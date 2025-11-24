import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { JobCard } from "../JobCard/JobCard";
import styles from "./BoardVagas.module.css";

function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

export default function BoardVagas({ limit = 4 }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedKey, setExpandedKey] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await api.get(
          `/vacancies`, {
            params: {
              released: true,
              status: 'published',
              per_page: Math.max(4, limit * 2),
              page: 1,
              include: 'address'
            }
          }
        );
        const data = resp?.data?.data ?? [];
        const included = resp?.data?.included ?? [];
        
        const idx = {};
        for (const it of included) {
          if (!it?.id) continue;
          const t = String(it.type || "").toLowerCase();
          idx[t] = idx[t] || {};
          idx[t][String(it.id)] = it;
        }

        const mapped = data.map((job) => {
          const attrs = job.attributes || {};
        
          let locationStr = "Localização não informada";
          const addressRel = job?.relationships?.address?.data;
          const pick = Array.isArray(addressRel) ? addressRel?.[0] : addressRel;
          if (pick?.id && pick?.type) {
            const node = idx[String(pick.type).toLowerCase()]?.[String(pick.id)];
            const city = node?.attributes?.city_name;
            const uf = node?.attributes?.state_abbreviation || node?.attributes?.state_name;
            if (city && uf) locationStr = `${city} - ${uf}`;
            else if (city) locationStr = city;
          }
          
          return {
            title: attrs.title || "Título não informado",
            description: stripHtml(attrs.description || "") || "Descrição não informada",
            location: locationStr,
            area: attrs.area || "",
            salary: attrs.salary || "",
            contractingRegime: attrs.contracting_regime || "",
            // construct full external link to the candidate portal (same as JobBoard)
            slugLink: attrs.slug ? `https://candidatos.abler.com.br/vagas/${attrs.slug}` : "#",
          };
        });
        if (!cancelled) setJobs(mapped.slice(0, limit));
      } catch (e) {
        if (!cancelled) setError("Erro ao carregar vagas");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => (cancelled = true);
  }, [limit]);

  if (loading) return <div className={styles.loading}>Carregando vagas...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {jobs.length ? (
          jobs.map((job, i) => {
            const uniqueKey = `${job.slugLink}-${job.title}-${i}`;
            return (
              <JobCard
                key={uniqueKey}
                title={job.title}
                description={job.description}
                location={typeof job.location === "string" ? job.location : "Localização não informada"}
                area={job.area}
                salary={job.salary}
                contractingRegime={job.contractingRegime}
                slugLink={job.slugLink}
                isExpanded={expandedKey === uniqueKey}
                onToggle={() => setExpandedKey((prev) => (prev === uniqueKey ? null : uniqueKey))}
              />
            );
          })
        ) : (
          <p>Nenhuma vaga encontrada.</p>
        )}
      </div>
      <div className={styles.footer}>
        <a href="/job-board" className={styles.viewAll} aria-label="Ver todas as vagas">VER TODAS AS VAGAS</a>
      </div>
    </div>
  );
}
