import React, { useState } from 'react';
import styles from './JobCard.module.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowToRight from '@mui/icons-material/KeyboardArrowRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PaidIcon from '@mui/icons-material/Paid';
import ContractingIcon from '@mui/icons-material/HowToReg';

export interface JobCardProps {
    title: string;
    description: string;
    location: string;
    area: string;
    salary: number | string;
    contractingRegime: string;
    slugLink: string;
}

export function JobCard(props: JobCardProps) {
    const {
        title,
        description,
        location,
        area,
        salary,
        contractingRegime,
        slugLink
    } = props;

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    function formatWithActivities(description: String) {
        const cleanedString = description.replace(/•\\t/g, '').trim();
    
        const sentences = cleanedString.split(/;<\/p>/);
    
        const formattedSentences = sentences.map(x => {
            const cleanSentence = x.replace(/<p>/g, '').replace(/<\/p>/g, '').trim();
            return `<p>• ${cleanSentence}</p>`;
        });

        return `<h6>Atividades:</h6>${formattedSentences.join('')}`;
    }

    const formattedSalary = (salary: number | string) => {
        if (typeof salary === "number") {
            return `R$ ${salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        }
        return salary === "to_match" ? "A combinar" : salary;
    };

    return (
        <div className={`card shadow-sm mb-4 ${styles.card} ${styles.textGreen}`}>
            <div className="card-body">
                <h5 className={`card-title ${styles.textGreen}`}>{title}</h5>

                <div className={`${styles.cardContent} ${isExpanded ? styles.expanded : ''}`}>
                    <div
                        className={`${styles.cardDescription} ${isExpanded ? styles.expanded : ''}`}
                        dangerouslySetInnerHTML={{ __html: `<ul>${formatWithActivities(description)}</ul>` }}
                    />
                    <div className={`${styles.detailscontainer} ${isExpanded ? styles.expanded : ''}`}>
                        <ul className="list-unstyled mb-3">
                            {location && (
                                <li className={styles.itemLi}>
                                    <LocationOnIcon className={styles.iconLi} />
                                    {location}
                                </li>
                            )}
                            {area && (
                                <li className={styles.itemLi}>
                                    <BusinessCenterIcon className={styles.iconLi} />
                                    {area}
                                </li>
                            )}
                            {salary && (
                                <li className={styles.itemLi}>
                                    <PaidIcon className={styles.iconLi} />
                                    {formattedSalary(salary)}
                                </li>
                            )}
                            {contractingRegime && (
                                <li className={styles.itemLi}>
                                    <ContractingIcon className={styles.iconLi} />
                                    {contractingRegime}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className={`d-flex justify-content-between align-items-center ${styles.containerBtn}`}>
                    <button
                        className={`btn-primary btn-sm ${styles.btn} ${styles.btnSecundary}`}
                        onClick={toggleExpand}
                    >
                        {isExpanded ? 'Esconder detalhes' : 'Detalhes da vaga'}{' '}
                        {isExpanded ? (
                            <KeyboardArrowUpIcon className={styles.iconButt} />
                        ) : (
                            <KeyboardArrowDownIcon className={styles.iconButt} />
                        )}
                    </button>

                    <a href={slugLink} target="_blank" rel="noopener noreferrer">
                        <button className={`btn-primary btn-sm ${styles.btn} ${styles.btnPrimary}`}>
                            Me candidatar <ArrowToRight className={styles.icon} />
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}
