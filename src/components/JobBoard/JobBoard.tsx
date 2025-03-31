import React, { useState, useEffect } from 'react';
import { JobCard, JobCardProps } from '../JobCard/JobCard';
import api from '../../utils/api';
import styles from './JobBoard.module.css';

export function JobBoard() {
    const [jobs, setJobs] = useState<JobCardProps[]>([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null); 

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/vacancies', {
                    params: {
                        released: 'true',
                        status: 'published',
                        per_page: 10,
                        page: 1
                    }
                });

                const jobData = Array.isArray(response.data?.data) ? response.data.data : [];

                const mappedJobs = jobData.map((job: any) => {
                    const title = job.attributes?.title || 'Título não informado';
                    const description = job.attributes?.description || 'Descrição não informada';
                    const location = job.attributes?.address ? job.attributes.address.data.id : 'Localização não informada';
                    const area = job.attributes?.area_of_interests?.data ? job.attributes.area_of_interests.data[0]?.id : 'Área não informada';
                    const salary = job.attributes?.salary || 'Salário não informado';
                    const contractingRegime = job.attributes?.contracting_regime || 'Regime de contratação não informado';
                    const slugLink = job.attributes?.slug || 'slug não informado'; 

                    return {
                        title,
                        description,
                        location,
                        area,
                        salary,
                        contractingRegime,
                        slugLink,
                    };
                });

                setJobs(mappedJobs); 
            } catch (err) {
                console.error('Erro ao carregar as vagas:', err);
                setError('Erro ao carregar as vagas');  
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.jobBoard}>
            <div className={styles.jobCardsContainer}>
                {jobs.map((job) => {
                    const jobUrl = `https://candidatos.abler.com.br/vagas/${job.slugLink}`;
                    return (
                        <JobCard
                            key={job.slugLink}
                            title={job.title}
                            description={job.description}
                            location={job.location}
                            area={job.area}
                            salary={job.salary}
                            contractingRegime={job.contractingRegime}
                            slugLink={jobUrl} 
                        />
                    );
                })}
            </div>
        </div>
    );
}
