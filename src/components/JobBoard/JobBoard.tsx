import React, { useState, useEffect } from 'react';
import { JobCard } from '../JobCard/JobCard';
import api from '../../utils/api';
import styles from './JobBoard.module.css';

type Job = {
  title: string;
  description: string;  
  location: string;
  area: string;
  salary: string | number;
  contractingRegime: string;
  seniority: string;
  slugLink: string;
};

type JobBoardProps = {
  busca: string;
  localFiltro: string;
  setLocalFiltro: (local: string) => void;
  tipoFiltro: string;
  senioridadeFiltro: string;
  areaFiltro?: string;
  salarioFiltro?: string;
  cities: string[];
  setCities: React.Dispatch<React.SetStateAction<string[]>>;
};

// --- util: limpa HTML e organiza quebras de linha
function stripHtml(html: string | null | undefined): string {
  if (!html) return '';

  let s = html;

  // quebra de linha para tags de bloco
  s = s.replace(/<\s*br\s*\/?>/gi, '\n');
  s = s.replace(/<\/\s*(p|div|h[1-6])\s*>/gi, '\n');
  s = s.replace(/<\/\s*li\s*>/gi, '\n');

  // remove o resto das tags
  s = s.replace(/<[^>]*>/g, '');

  // normaliza espaços/entidades
  s = s.replace(/&nbsp;/gi, ' ');
  s = s.replace(/\u00A0/g, ' ');
  s = s.replace(/\s+\n/g, '\n');
  s = s.replace(/\n{3,}/g, '\n\n');

  // padroniza marcadores
  s = s.replace(/^\s*-\s*/gm, '• ');
  s = s.replace(/ *●\s*/g, '\n• ');

  return s.trim();
}

export function JobBoard({
  busca,
  localFiltro,
  setLocalFiltro,
  tipoFiltro,
  senioridadeFiltro,
  areaFiltro,
  salarioFiltro,
  cities,
  setCities,
}: JobBoardProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const response = await api.get('/vacancies', {
        params: {
          released: 'true',
          status: 'published',
          per_page: 50,
          page: 1,
          include: 'address',
        },
      });

      const jobData = response.data?.data ?? [];
      const included = response.data?.included ?? [];

      const addressMap: Record<string, { city: string }> = {};
      included.forEach((item: any) => {
        if (item.type === 'address') {
          addressMap[item.id] = {
            city: item.attributes.city_name || 'Localização não informada',
          };
        }
      });

      const mappedJobs: Job[] = jobData.map((job: any) => {
        const addressId = job.relationships?.address?.data?.id;

        const rawDesc = job.attributes?.description || 'Descrição não informada';
        const cleanDesc = stripHtml(rawDesc);

        return {
          title: job.attributes?.title || 'Título não informado',
          description: cleanDesc,
          location: addressId ? addressMap[addressId]?.city || 'Localização não informada' : 'Localização não informada',
          area: job.relationships?.area_of_interests?.data?.[0]?.id || 'Área não informada',
          salary: job.attributes?.salary ?? 'Salário não informado',
          contractingRegime: job.attributes?.contracting_regime || 'Tipo não informado',
          seniority: job.attributes?.seniority || 'Senioridade não informada',
          slugLink: job.attributes?.slug || 'slug-nao-informado',
        };
      });

      setJobs(mappedJobs);

      const uniqueCities = Array.from(
        new Set(mappedJobs.map((job) => job.location))
      ).sort() as string[];
      setCities(uniqueCities);
    } catch (err) {
      console.error('Erro ao carregar as vagas:', err);
      setError('Erro ao carregar as vagas');
    } finally {
      setLoading(false);
    }
  }

  const vagasFiltradas = jobs.filter((vaga) => {
    const matchBusca = vaga.title.toLowerCase().includes(busca.toLowerCase());
    const matchLocal = localFiltro === 'Todos' || vaga.location === localFiltro;
    const matchTipo = tipoFiltro === 'Todos' || vaga.contractingRegime === tipoFiltro;
    const matchSenioridade = senioridadeFiltro === 'Todos' || vaga.seniority === senioridadeFiltro;
    const matchArea = !areaFiltro || areaFiltro === 'Todos' || vaga.area === areaFiltro;
    const matchSalario = !salarioFiltro || salarioFiltro === 'Todos' || String(vaga.salary) === salarioFiltro;

    return matchBusca && matchLocal && matchTipo && matchSenioridade && matchArea && matchSalario;
  });

  const handleToggleExpand = (key: string) => {
    setExpandedSlug((prev) => (prev === key ? null : key));
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.jobBoard}>
      {/* filtro cidade */}
      <div className={styles.filterContainer}>
        <label htmlFor="cityFilter" className={styles.filterLabel}>
          Filtrar por cidade:
        </label>
        <select
          id="cityFilter"
          value={localFiltro}
          onChange={(e) => setLocalFiltro(e.target.value)}
          className={styles.select}
        >
          <option value="Todos">Todos</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
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
    </div>
  );
}
