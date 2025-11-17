import React from 'react';
import styles from './JobCard.module.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowToRight from '@mui/icons-material/ArrowRight';
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
  isExpanded: boolean;
  onToggle: () => void;
}

export function JobCard(props: JobCardProps) {
  const {
    title,
    description,
    location,
    area,
    salary,
    contractingRegime,
    slugLink,
    isExpanded,
    onToggle,
  } = props;

  const formattedSalary = (salary: number | string) => {
    if (typeof salary === 'number') {
      return `R$ ${salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    return salary === 'to_match' ? 'A combinar' : salary;
  };

  const formattedRegime = (regime: string) => {
    return regime === 'to_match' ? 'A combinar' : regime.toLocaleUpperCase();
  };

  return (
    <div className={`card shadow-sm mb-4 ${styles.card} ${isExpanded ? styles.cardExpanded : styles.cardCollapsed} ${styles.textGreen}`}>
      <div className={`${styles.cardBody}`}>
        <h5 className={`card-title ${styles.cardTitle}`}>{title}</h5>

        <div className={styles.cardContent}>
          <div
            className={`${styles.cardDescription} ${
              !isExpanded ? styles.clamped : styles.expanded
            } ${isExpanded ? styles.mobileShowWhenExpanded : ''}`}
          >
            <p className={styles.cardText}>{description}</p>
          </div>

          <div
            className={`${styles.detailscontainer} ${
              isExpanded ? styles.expanded : ''
            }`}
          >
            <ul className={styles.detailsList}>
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
              {salary !== undefined && salary !== null && salary !== '' && (
                <li className={styles.itemLi}>
                  <PaidIcon className={styles.iconLi} />
                  {formattedSalary(salary)}
                </li>
              )}
              {contractingRegime && (
                <li className={styles.itemLi}>
                  <ContractingIcon className={styles.iconLi} />
                  {formattedRegime(contractingRegime)}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div
          className={`d-flex justify-content-between align-items-center ${styles.containerBtn}`}
        >
          <button
            className={`btn-primary btn-sm ${styles.btn} ${styles.btnSecundary}`}
            onClick={onToggle}
          >
            {isExpanded ? 'Esconder detalhes' : 'Detalhes da vaga'}{' '}
            {isExpanded ? (
              <KeyboardArrowUpIcon className={styles.iconButt} />
            ) : (
              <KeyboardArrowDownIcon className={styles.iconButt} />
            )}
          </button>

          <a href={slugLink} target="_blank" rel="noopener noreferrer">
            <button
              className={`btn-primary btn-sm ${styles.btn} ${styles.btnPrimary}`}
            >
              Me candidatar <ArrowToRight className={styles.icon} />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
