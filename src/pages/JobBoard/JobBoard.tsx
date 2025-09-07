import React, { useEffect, useMemo, useState } from "react";
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

type Job = {
  title: string;
  description: string;
  location: string;
  area: string;
  segmento: string;
  disciplina: string;
  salary: string | number;
  contractingRegime: string;
  seniority: string;
  slugLink: string;
  isBilingual: boolean;
};

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const { data: payload } = await tryFetchWithIncludeFormats({
        released: "true",
        status: "published",
        per_page: 50,
        page: 1,
      });

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
        const disciplina = relLabel(job, "subjects", idx, () => {
          const t = `${attrs.title} ${cleanDesc}`;
          if (/matem[aá]tica/i.test(t)) return "Matemática";
          if (/portugu[eê]s/i.test(t)) return "Português";
          if (/hist[oó]ria/i.test(t)) return "História";
          if (/geografia/i.test(t)) return "Geografia";
          if (/ci[eê]ncias/i.test(t)) return "Ciências";
          if (/ingl[eê]s|english/i.test(t)) return "Inglês";
          return undefined;
        });

        const isBilingual = detectBilingual(job, idx, title, cleanDesc);

        return {
          title,
          description: cleanDesc || "Descrição não informada",
          location,
          area,
          segmento,
          disciplina,
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
      Array.from(new Set(arr.filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, "pt-BR")
      );

    const cfg = [
      { key: "area" as const,       label: "Área de atuação",  options: uniq(jobs.map(j => j.area)).map(v => ({ value: v, label: v })) },
      { key: "segmento" as const,   label: "Segmento escolar", options: uniq(jobs.map(j => j.segmento)).map(v => ({ value: v, label: v })) },
      { key: "disciplina" as const, label: "Disciplina",       options: uniq(jobs.map(j => j.disciplina)).map(v => ({ value: v, label: v })) },
      { key: "localizacao" as const,label: "Localização",      options: uniq(jobs.map(j => j.location)).map(v => ({ value: v, label: v })) },
      { key: "bilingue" as const,   label: "Bilíngue",         options: [{ value: "sim", label: "Bilíngue" }, { value: "nao", label: "Não bilíngue" }] },
    ] as FilterConfig[];

    return cfg;
  }, [jobs]);

  const vagasFiltradas = useMemo(() => {
    return jobs.filter((v) => {
      const okArea = !filters.area || v.area === filters.area;
      const okSeg = !filters.segmento || v.segmento === filters.segmento;
      const okDisc = !filters.disciplina || v.disciplina === filters.disciplina;
      const okLoc = !filters.localizacao || v.location === filters.localizacao;
      const okBil =
        !filters.bilingue ||
        (filters.bilingue === "sim" ? v.isBilingual : !v.isBilingual);
      return okArea && okSeg && okDisc && okLoc && okBil;
    });
  }, [jobs, filters]);

  const handleToggleExpand = (key: string) => {
    setExpandedSlug((prev) => (prev === key ? null : key));
  };

  if (loading) return <div>Carregando...</div>;
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

        <div className={styles.filters}>
          <FiltersBar configs={filterConfigs} value={filters} onChange={setFilters} />
        </div>

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
      </section>
    </div>
  );
}

function buildCommaSeparated() {
  return "address,area_of_interests,vacancies_languages,languages,subjects,school_segments";
}
function buildRepeatParam() {
  const inc = ["address","area_of_interests","vacancies_languages","languages","subjects","school_segments"];
  return inc.map(v => `include[]=${encodeURIComponent(v)}`).join("&");
}
function buildJsonArray() {
  const arr = ["address","area_of_interests","vacancies_languages","languages","subjects","school_segments"];
  return encodeURIComponent(JSON.stringify(arr));
}
function buildMultiIncludeKeys() {
  const inc = ["address","area_of_interests","vacancies_languages","languages","subjects","school_segments"];
  return inc.map(v => `include=${encodeURIComponent(v)}`).join("&");
}

async function tryFetchWithIncludeFormats(baseParams: Record<string,string|number>) {
  const variants = [
    { label: "comma",        query: `include=${encodeURIComponent(buildCommaSeparated())}` },
    { label: "repeatParam",  query: buildRepeatParam() },
    { label: "jsonArray",    query: `include=${buildJsonArray()}` },
    { label: "multiKeys",    query: buildMultiIncludeKeys() },
    { label: "onlyAddress",  query: `include=address` },
    { label: "baseline",     query: "" }, 
  ];

  const fixed =
    Object.entries(baseParams)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&");

  for (const v of variants) {
    try {
      const url = `/vacancies?${fixed}${v.query ? `&${v.query}` : ""}`;
      const resp = await api.get(url);
      const data = resp?.data ?? {};
      const hasIncluded = Array.isArray(data.included) && data.included.length > 0;
      const hasData = Array.isArray(data.data);
      if (hasIncluded || hasData) {
        return { data };
      }
    } catch (_e) {
    }
  }

  throw new Error("Não foi possível obter as vagas (todas as variações de include falharam).");
}

type IncludedIndex = Record<string, Record<string, any>>;
const normType = (s: any) => String(s || "").toLowerCase().replace(/[^a-z_]/g, "");

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

function relData(job: any, relKey: string): { id?: string; type?: string } | undefined {
  const rel = job?.relationships?.[relKey]?.data;
  if (!rel) return undefined;
  if (Array.isArray(rel)) return rel[0] ? { id: String(rel[0].id), type: rel[0].type } : undefined;
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
    const uf = node?.attributes?.state_abbreviation || node?.attributes?.state_name;
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

function detectBilingual(job: any, idx: IncludedIndex, title: string, desc: string): boolean {
  const rel = job?.relationships?.vacancies_languages?.data;
  if (Array.isArray(rel) && rel.length) {
    for (const link of rel) {
      const vacLang = idx[normType(link.type)]?.[String(link.id)];
      const langId = vacLang?.relationships?.language?.data?.id;
      const langType = vacLang?.relationships?.language?.data?.type || "language";
      const langNode = langId ? idx[normType(langType)]?.[String(langId)] : undefined;
      const langName = safeLabel(vacLang) || safeLabel(langNode);
      const ln = (langName || "").toLowerCase();
      if (/(ingl|\benglish\b|\ben\b)/.test(ln)) return true;
    }
  }
  const text = `${title} ${desc}`.toLowerCase();
  return /(bil[ií]ngue|bilingual|dual\s*language|internacional|ingl[eê]s)/.test(text);
}
