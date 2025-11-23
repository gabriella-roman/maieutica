import React, { useEffect, useMemo, useState } from "react";
import { JobCard } from "../JobCard/JobCard";
import api from "../../utils/api";
import styles from "./JobBoard.module.css";

import { Header } from "../Header/Header";
import { Banner } from "../Banner/Banner";
import { WhatWeDo } from "../WhatWeDo/WhatWeDo";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  FiltersBar,
  FilterConfig,
  FiltersState,
} from "../Filters/FiltersBar";

type Job = {
  title: string;
  description: string;
  location: string;
  area: string;
  segmento: string;
  disciplina: string;
  languages: string[];
  salary: string | number;
  contractingRegime: string;
  seniority: string;
  slugLink: string;
  isBilingual: boolean;
};

function useIsDesktop(breakpoint = 768) {
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

export default function JobBoardComponent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const isDesktop = useIsDesktop(768);


  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const includeStr =
        "address,area_of_interests,vacancies_languages.language,level_of_interest";

      const { data } = await api.get("/vacancies", {
        params: {
          released: "true",
          status: "published",
          per_page: 50,
          page: 1,
          include: includeStr,
        },
      });

      const jobData = data?.data ?? [];
      const included = data?.included ?? [];
      const idx: Record<string, Record<string, any>> = {};
      for (const it of included) {
        if (!it?.id) continue;
        const t = String(it.type || "").toLowerCase();
        idx[t] ??= {};
        idx[t][String(it.id)] = it;
      }

      const mappedJobs: Job[] = jobData.map((job: any) => {
        const attrs = job?.attributes ?? {};
        const title = attrs.title || "Título não informado";
        const cleanDesc = stripHtml(attrs.description || "");

        const location = resolveLocation(job, idx);
        const area = resolveArea(job, idx);
        const segmento = inferSegmentoFromText(title, cleanDesc);
        const disciplina = inferDisciplinaFromText(title, cleanDesc);

        const languages = extractLanguages(job, idx);
        const isBilingual = detectBilingual(title, cleanDesc, languages);

        return {
          title,
          description: cleanDesc || "Descrição não informada",
          location,
          area,
          segmento,
          disciplina,
          languages,
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
  }

  const filterConfigs: FilterConfig[] = useMemo(() => {
    const uniq = (arr: string[]) =>
      Array.from(new Set(arr.filter(Boolean)))
        .filter((v) => v !== "Não informado" && v !== "Não informada")
        .sort((a, b) => a.localeCompare(b, "pt-BR"));
        
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
    const disciplinas = uniq(jobs.map((j) => j.disciplina));
    const locais = uniq(jobs.map((j) => j.location));

    return [
      { key: "localizacao", label: "Localização", options: locais.map((v) => ({ value: v, label: v })) },
      { key: "area", label: "Área de atuação", options: areas.map((v) => ({ value: v, label: v })) },
      { key: "disciplina", label: "Disciplina", options: disciplinas.map((v) => ({ value: v, label: v })) },
      { key: "bilingue", label: "Bilíngue", options: [{ value: "sim", label: "Bilíngue" }, { value: "nao", label: "Não bilíngue" }] },
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
      const okDisc = !filters.disciplina || filters.disciplina.length === 0 || filters.disciplina.includes(v.disciplina);
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

  if (loading) return <div>CTESTE</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.page}>
      <Header />
      <Banner
        title="Painel de vagas"
        breadcrumb={["Home", "Painel de vagas"]}
        bgColor="#5A9E8C"
      />

      <section className={styles.section}>
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

        <p style={{ color: "red" }}>
          viewport: {typeof window !== "undefined" ? window.innerWidth : "ssr"}px –
          modo: {isDesktop ? "DESKTOP" : "MOBILE"}
        </p>

        <p>Vagas encontradas: {vagasFiltradas.length}</p>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
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
    </div>
  );
}

/* ------------ HELPERS ------------ */

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

function safeLabel(node: any): string | undefined {
  const a = node?.attributes ?? {};
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

function getRel(job: any, relKey: string) {
  return job?.relationships?.[relKey]?.data;
}

function resolveLocation(
  job: any,
  idx: Record<string, Record<string, any>>
): string {
  const rel = getRel(job, "address");
  const pick = Array.isArray(rel) ? rel?.[0] : rel;
  if (pick?.id && pick?.type) {
    const node = idx[String(pick.type).toLowerCase()]?.[String(pick.id)];
    const city = node?.attributes?.city_name;
    const uf =
      node?.attributes?.state_abbreviation || node?.attributes?.state_name;
    if (city && uf) return `${city} - ${uf}`;
    if (city) return city;
  }
  return "Localização não informada";
}

function resolveArea(
  job: any,
  idx: Record<string, Record<string, any>>
): string {
  const rel =
    job?.relationships?.area_of_interests?.data ??
    job?.relationships?.area_of_interest?.data;

  const picks = Array.isArray(rel) ? rel : rel ? [rel] : [];
  if (!picks.length) return "Não informado";

  const names: string[] = [];
  for (const p of picks) {
    if (!p?.id || !p?.type) continue;
    const t = String(p.type).toLowerCase();
    const node = idx[t]?.[String(p.id)];
    const name =
      node?.attributes?.name ??
      node?.attributes?.title ??
      node?.attributes?.label;
    if (name) names.push(String(name).trim());
  }

  return names.length
    ? Array.from(new Set(names)).join(" · ")
    : "Não informado";
}

function inferSegmentoFromText(title: string, desc: string): string {
  const txt = `${title} ${desc}`.toLowerCase();
  if (/infantil/.test(txt)) return "Educação Infantil";
  if (/fundamental/.test(txt)) return "Ensino Fundamental";
  if (/m[eé]dio/.test(txt)) return "Ensino Médio";
  return "Não informada";
}

function inferDisciplinaFromText(title: string, desc: string): string {
  const t = `${title} ${desc}`.toLowerCase();
  if (/matem[aá]tica/.test(t)) return "Matemática";
  if (/portugu[eê]s/.test(t)) return "Português";
  if (/hist[oó]ria/.test(t)) return "História";
  if (/geografia/.test(t)) return "Geografia";
  if (/ci[eê]ncias/.test(t)) return "Ciências";
  if (/ingl[eê]s|english/.test(t)) return "Inglês";
  return "Não informada";
}

function extractLanguages(
  job: any,
  idx: Record<string, Record<string, any>>
): string[] {
  const rel = getRel(job, "vacancies_languages");
  const langs: string[] = [];
  if (Array.isArray(rel)) {
    for (const link of rel) {
      const vacLang =
        idx[String(link.type).toLowerCase()]?.[String(link.id)];
      const langId = vacLang?.relationships?.language?.data?.id;
      const langTyp =
        vacLang?.relationships?.language?.data?.type || "language";
      const langNode = langId
        ? idx[String(langTyp).toLowerCase()]?.[String(langId)]
        : undefined;
      const name = safeLabel(langNode) || safeLabel(vacLang);
      if (name) langs.push(String(name).trim());
    }
  }
  return Array.from(new Set(langs)).filter(Boolean);
}

function detectBilingual(
  title: string,
  desc: string,
  langs: string[]
): boolean {
  const hasEnglish = langs.some((n) =>
    n.toLowerCase().match(/\bingl|\benglish\b/)
  );
  if (hasEnglish) return true;
  const text = `${title} ${desc}`.toLowerCase();
  return /(bil[ií]ngue|bilingual|dual\s*language|internacional|ingl[eê]s)/.test(
    text
  );
}
