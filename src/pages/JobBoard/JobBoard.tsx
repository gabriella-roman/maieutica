import React, { useCallback, useEffect, useMemo, useState } from "react";
import { JobCard } from "../../components/JobCard/JobCard";
import api from "../../utils/api";
import styles from "./JobBoard.module.css";

import { Header } from "../../components/Header/Header";
import { Banner } from "../../components/Banner/Banner";
import { WhatWeDo } from "../../components/WhatWeDo/WhatWeDo";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  FiltersBar,
  FilterConfig,
  FiltersState,
} from "../../components/Filters/FiltersBar";
import { normalizeLabel, titleCase } from "../../utils/normalize";
import { Footer } from "../../components/Footer/Footer";

type Job = {
  title: string;
  description: string;
  location: string;
  area: string;
  segmento: string;
  disciplina: string;
  disciplinaList?: string[];
  disciplinaNormalized?: string[];
  salary: string | number;
  contractingRegime: string;
  seniority: string;
  slugLink: string;
  isBilingual: boolean;
};

function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isDesktop;
}

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const isDesktop = useIsDesktop(1024);

  const requestVacancies = useCallback(async (includeParam: string) => {
    return api.get('/vacancies', {
      params: {
        released: 'true',
        status: 'published',
        per_page: 50,
        page: 1,
        include: includeParam,
      },
    });
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setError(null);

      let response;
      try {
        response = await requestVacancies('address,area_of_interests,subjects,school_segments');
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 400) {
          response = await requestVacancies('address');
        } else {
          throw err;
        }
      }

      const payload = response?.data ?? {};
      const jobData = payload?.data ?? [];
      const included = payload?.included ?? [];
      const idx = buildIncludedIndex(included);

      const mappedJobs: Job[] = jobData.map((job: any) => {
        const attrs = job?.attributes ?? {};
        const title = attrs.title || "Título não informada";
        const cleanDesc = stripHtml(attrs.description || "");

        const location = resolveLocation(job, idx);
        const area = relLabel(job, "area_of_interests", idx);
        const segmento = relLabel(job, "school_segments", idx, () => {
          const t = `${attrs.title} ${cleanDesc}`;
          if (/infantil/i.test(t)) return "Educação Infantil";
          if (/fundamental/i.test(t)) return "Ensino Fundamental";
          if (/m[eé]dio/i.test(t)) return "Ensino Médio";
          return undefined;
        });
        let disciplina = relLabel(job, "subjects", idx, () => {
          const t = `${attrs.title} ${cleanDesc}`;
          if (/matem[aá]tica/i.test(t)) return "Matemática";
          if (/portugu[eê]s/i.test(t)) return "Português";
          if (/hist[oó]ria/i.test(t)) return "História";
          if (/geografia/i.test(t)) return "Geografia";
          if (/ci[eê]ncias/i.test(t)) return "Ciências";
          if (/ingl[eê]s|english/i.test(t)) return "Inglês";
          return undefined;
        });

        const attrCourses = attrs.courses;
        if ((disciplina === "Não informado" || !disciplina) && Array.isArray(attrCourses) && attrCourses.length) {
          const names = attrCourses.filter(Boolean).map((n: any) => String(n).trim());
          if (names.length) disciplina = Array.from(new Set(names)).join(" · ");
        }

        const disciplinaList = disciplina && disciplina !== "Não informado" ? String(disciplina).split(" · ").map((s) => String(s || "").trim()).filter(Boolean) : [];
        const disciplinaNormalized = Array.from(new Set(disciplinaList.map((d) => normalizeLabel(d)).filter(Boolean)));

        const isBilingual = detectBilingual(job, idx, title, cleanDesc);

        return {
          title,
          description: cleanDesc || "Descrição não informada",
          location,
          area,
          segmento,
          disciplina,
          disciplinaList,
          disciplinaNormalized,
          salary: attrs.salary ?? "Salário não informada",
          contractingRegime: attrs.contracting_regime || "Tipo não informada",
          seniority: attrs.seniority || "Senioridade não informada",
          slugLink: attrs.slug || "slug-nao-informado",
          isBilingual,
        };
      });

      setJobs(mappedJobs);
    } catch (err) {
      console.error("Erro ao carregar as vagas:", err);
      setError("Erro ao carregar as vagas");
    } finally {
      setLoading(false);
    }
  }, [requestVacancies]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filterConfigs: FilterConfig[] = useMemo(() => {
    const uniq = (arr: string[]) =>
      Array.from(new Set(arr.filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, "pt-BR")
      );

    const classifyArea = (title: string, desc: string) => {
      const txt = `${title || ""} ${desc || ""}`.toLowerCase();
      if (/infantil/.test(txt)) return "Educação Infantil";
      if (/fundamental.*(ii|2|segunda|segundo|segunda etapa)|ensino fundamental ii/.test(txt))
        return "Ensino Fundamental II";
      if (/fundamental.*(i\b|1|primeira|primeiro|primeira etapa)|ensino fundamental i/.test(txt))
        return "Ensino Fundamental I";
      if (/superior|universi|gradua|licenciatura/.test(txt)) return "Ensino Superior";
      return "Outros";
    };

    const areas = uniq(jobs.map((j) => classifyArea(j.title, j.description)));
    const locais = uniq(jobs.map((j) => j.location));

    const discMap = new Map<string, { label: string; count: number }>();
    for (const jb of jobs) {
      const list = (jb as any).disciplinaList ?? [];
      // count each normalized discipline at most once per job
      const seen = new Set<string>();
      for (const d of list) {
        const norm = normalizeLabel(d);
        if (!norm || seen.has(norm)) continue;
        seen.add(norm);
        const existing = discMap.get(norm);
        const display = titleCase(d);
        if (existing) existing.count++;
        else discMap.set(norm, { label: display, count: 1 });
      }
    }

    const disciplinasOptions = Array.from(discMap.entries())
      .sort((a, b) => a[1].label.localeCompare(b[1].label, "pt-BR"))
      .map(([norm, meta]) => ({ value: norm, label: `${meta.label} (${meta.count})` }));

    return [
      { key: "localizacao" as const, label: "Localização", options: locais.map((v) => ({ value: v, label: v })) },
      { key: "area" as const, label: "Área de atuação", options: areas.map((v) => ({ value: v, label: v })) },
      { key: "disciplina" as const, label: "Disciplina", options: disciplinasOptions },
      { key: "bilingue" as const, label: "Bilíngue", options: [{ value: "sim", label: "Bilíngue" }, { value: "nao", label: "Não bilíngue" }] },
    ] as FilterConfig[];
  }, [jobs]);

  const vagasFiltradas = useMemo(() => {
    const classifyArea = (title: string, desc: string) => {
      const txt = `${title || ""} ${desc || ""}`.toLowerCase();
      if (/infantil/.test(txt)) return "Educação Infantil";
      if (/fundamental.*(ii|2|segunda|segundo|segunda etapa)|ensino fundamental ii/.test(txt))
        return "Ensino Fundamental II";
      if (/fundamental.*(i\b|1|primeira|primeiro|primeira etapa)|ensino fundamental i/.test(txt))
        return "Ensino Fundamental I";
      if (/superior|universi|gradua|licenciatura/.test(txt)) return "Ensino Superior";
      return "Outros";
    };

    return jobs.filter((v) => {
      const classified = classifyArea(v.title, v.description);
      
      const okArea = !filters.area || filters.area.length === 0 || filters.area.includes(classified);
      const selectedDisc = filters.disciplina ?? [];
      const okDisc =
        selectedDisc.length === 0 ||
        (Array.isArray((v as any).disciplinaNormalized) && (v as any).disciplinaNormalized.some((nd: string) => selectedDisc.includes(nd)));
      const okLoc = !filters.localizacao || filters.localizacao.length === 0 || filters.localizacao.includes(v.location);
      
      const okBil = !filters.bilingue || filters.bilingue.length === 0 || 
        (filters.bilingue.includes("sim") && v.isBilingual) ||
        (filters.bilingue.includes("nao") && !v.isBilingual);
      
      return okArea && okDisc && okLoc && okBil;
    });
  }, [jobs, filters]);

  const handleToggleExpand = (key: string) => {
    setExpandedSlug((prev) => (prev === key ? null : key));
  };

  if (loading)
    return (
      <div className={styles.loaderOverlay} role="status" aria-live="polite">
        <div className={styles.loader}>
          <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" className="pencil" aria-hidden>
            <defs>
              <clipPath id="pencil-eraser">
                <rect height="30" width="30" ry="5" rx="5"></rect>
              </clipPath>
            </defs>
            <circle transform="rotate(-113,100,100)" stroke-linecap="round" stroke-dashoffset="439.82" stroke-dasharray="439.82 439.82" stroke-width="2" stroke="#427161" fill="none" r="70" className="pencil__stroke"></circle>
            <g transform="translate(100,100)" className="pencil__rotate">
              <g fill="none">
                <circle transform="rotate(-90)" stroke-dashoffset="402" stroke-dasharray="402.12 402.12" stroke-width="30" stroke="#5A9E8C" r="64" className="pencil__body1"></circle>
                <circle transform="rotate(-90)" stroke-dashoffset="465" stroke-dasharray="464.96 464.96" stroke-width="10" stroke="#9CC5BA" r="74" className="pencil__body2"></circle>
                <circle transform="rotate(-90)" stroke-dashoffset="339" stroke-dasharray="339.29 339.29" stroke-width="10" stroke="#427161" r="54" className="pencil__body3"></circle>
              </g>
              <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
                <g className="pencil__eraser-skew">
                  <rect height="30" width="30" ry="5" rx="5" fill="#DEECE8"></rect>
                  <rect clip-path="url(#pencil-eraser)" height="30" width="5" fill="#9CC5BA"></rect>
                  <rect height="20" width="30" fill="#FFFFFF"></rect>
                  <rect height="20" width="15" fill="#F4F4F5"></rect>
                  <rect height="20" width="5" fill="#E6E7E6"></rect>
                  <rect height="2" width="30" y="6" fill="rgba(0,0,0,0.08)"></rect>
                  <rect height="2" width="30" y="13" fill="rgba(0,0,0,0.08)"></rect>
                </g>
              </g>
              <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
                <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
                <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
                <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)"></polygon>
              </g>
            </g>
          </svg>
            <div className={styles.loaderText} aria-hidden>
              Buscando vagas
            </div>
          </div>
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.page}>
  <Header headerBg="transparent" headerFg="#ffffff" />
      <Banner
        title="Painel de vagas"
        breadcrumb={["Home", "Painel de vagas"]}
        bgColor="#5A9E8C"
      />

      <section className={styles.section}>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>

            <div className={styles.whatWeDoWrapper}>
              <WhatWeDo
                badgeIcon={<FontAwesomeIcon icon={faBriefcase} />}
                title="Confira as vagas"
                showButton={false}
                text1="Entre em contato para tirar dúvidas, solicitar informações ou conversar com nossa equipe."
                text2="Estamos prontos para ajudar!"
                colors={{
                  accent: "#5A9E8C",
                  badgeBg: "rgb(200, 255, 235)",
                  badgeFg: "#5A9E8C",
                }}
                badgeText={"CONECTANDO PESSOAS"}
              />
            </div>
            {isDesktop ? (
              <div className={styles.filtersDesktop}>
                {filterConfigs.map((cfg) => (
                  <div key={cfg.key} className={styles.filterGroup}>
                    <h3 className={styles.filterGroupTitle}>{cfg.label}</h3>
                    <div className={styles.filterGroupOptions}>
                      {cfg.options.map((opt) => {
                        const current = filters[cfg.key] ?? [];
                        const checked = current.includes(opt.value);
                        return (
                          <label
                            key={opt.value}
                            className={styles.filterOption}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                const next: FiltersState = { ...filters };
                                const currentValues = next[cfg.key] ?? [];
                                if (checked) {
                                  next[cfg.key] = currentValues.filter(v => v !== opt.value);
                                  if (next[cfg.key]?.length === 0) {
                                    delete next[cfg.key];
                                  }
                                } else {
                                  next[cfg.key] = [...currentValues, opt.value];
                                }
                                  setFilters(next);
                                  if (isDesktop && typeof window !== "undefined") {
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }
                              }}
                            />
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.filtersMobile}>
                <FiltersBar
                  configs={filterConfigs}
                  value={filters}
                  onChange={setFilters}
                  className={styles.sidebarFilters}
                />
              </div>
            )}
          </aside>

          <main className={styles.content}>
            <div className={styles.grid}>
              {vagasFiltradas.length > 0 ? (
                vagasFiltradas.map((job) => {
                  const uniqueKey = `${job.slugLink}-${job.title}`;
                  return (
                    <JobCard
                      key={uniqueKey}
                      title={job.title}
                      description={job.description}
                      location={job.location}
                      area={job.area}
                      salary={job.salary}
                      contractingRegime={job.contractingRegime}
                      slugLink={`https://candidatos.abler.com.br/vagas/${job.slugLink}`}
                      isExpanded={expandedSlug === uniqueKey}
                      onToggle={() => handleToggleExpand(uniqueKey)}
                    />
                  );
                })
              ) : (
                <p>Nenhuma vaga encontrada.</p>
              )}
            </div>
          </main>
        </div>
      </section>
      <Footer />
    </div>
  );
}

type IncludedIndex = Record<string, Record<string, any>>;
const normType = (s: any) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z_]/g, "");

function buildIncludedIndex(included: any[] = []): IncludedIndex {
  const idx: IncludedIndex = {};
  for (const it of included) {
    if (!it || !it.id) continue;
    const t = normType(it.type);
    const id = String(it.id);
    idx[t] ??= {};
    idx[t][id] = it;
  }
  return idx;
}

function safeLabel(node: any): string | undefined {
  if (!node) return undefined;
  const a = node.attributes ?? {};
  return (
    a.name ||
    a.title ||
    a.label ||
    a.city_name ||
    a.state_name ||
    a.description ||
    a.slug
  );
}

function relData(
  job: any,
  relKey: string
): { id?: string; type?: string } | undefined {
  const rel = job?.relationships?.[relKey]?.data;
  if (!rel) return undefined;
  if (Array.isArray(rel))
    return rel[0]
      ? { id: String(rel[0].id), type: rel[0].type }
      : undefined;
  return { id: String(rel.id), type: rel.type };
}

function relLabel(
  job: any,
  relKey: string,
  idx: IncludedIndex,
  fallback?: (job: any) => string | undefined
): string {
  const rd = relData(job, relKey);
  if (rd?.id && rd?.type) {
    const t = normType(rd.type);
    const node = idx[t]?.[rd.id];
    const label = safeLabel(node);
    if (label) return String(label);
  }
  return (fallback && fallback(job)) || "Não informado";
}

function resolveLocation(job: any, idx: IncludedIndex): string {
  const rd = relData(job, "address");
  if (rd?.id) {
    const node = idx[normType(rd.type)]?.[rd.id];
    const city = node?.attributes?.city_name;
    const uf =
      node?.attributes?.state_abbreviation ||
      node?.attributes?.state_name;
    if (city && uf) return `${city} - ${uf}`;
    if (city) return city;
  }
  return "Localização não informada";
}

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  let s = html;
  s = s.replace(/<\s*br\s*\/?>/gi, "\n");
  s = s.replace(/<\/\s*(p|div|h[1-6])\s*>/gi, "\n");
  s = s.replace(/<\/\s*li\s*>/gi, "\n");
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/&nbsp;/gi, " ");
  s = s.replace(/\u00A0/g, " ");
  s = s.replace(/\s+\n/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.replace(/^\s*-\s*/gm, "• ");
  s = s.replace(/ *●\s*/g, "\n• ");
  return s.trim();
}

function detectBilingual(
  job: any,
  idx: IncludedIndex,
  title: string,
  desc: string
): boolean {
  const rel = job?.relationships?.vacancies_languages?.data;
  if (Array.isArray(rel) && rel.length) {
    for (const link of rel) {
      const vacLang =
        idx[normType(link.type)]?.[String(link.id)];
      const langId = vacLang?.relationships?.language?.data?.id;
      const langType =
        vacLang?.relationships?.language?.data?.type || "language";
      const langNode = langId
        ? idx[normType(langType)]?.[String(langId)]
        : undefined;
      const langName = safeLabel(vacLang) || safeLabel(langNode);
      const ln = (langName || "").toLowerCase();
      if (/(ingl|\benglish\b|\ben\b)/.test(ln)) return true;
    }
  }
  const text = `${title} ${desc}`.toLowerCase();
  return /(bil[ií]ngue|bilingual|dual\s*language|internacional|ingl[eê]s)/.test(
    text
  );
}
