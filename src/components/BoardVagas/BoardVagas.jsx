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
          `/vacancies?released=true&status=published&per_page=${Math.max(4, limit * 2)}&page=1`
        );
        const data = resp?.data?.data ?? [];
        const mapped = data.map((job) => {
          const attrs = job.attributes || {};
          return {
            title: attrs.title || "Título não informado",
            description: stripHtml(attrs.description || "") || "Descrição não informada",
            location: attrs?.address ? attrs.address : "Localização não informada",
            area: attrs.area || "",
            salary: attrs.salary || "",
            contractingRegime: attrs.contracting_regime || "",
            slugLink: attrs.slug || "#",
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
