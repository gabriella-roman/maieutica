import React from "react";
import styles from "./BannerHome.module.css";
import { colors } from "@mui/material";

import ImagemBannerMulher from '../../assets/images/ImagemBannerMulher.svg'

export function BannerHome() {
  return (
    <section className={styles.banner} aria-label="Destaque Maieútica">
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon} aria-hidden="true">✳</span>
            <span>CONECTANDO PESSOAS</span>
          </div>

          <h1 className={styles.title}>
            Desde 2008, buscando os melhores educadores
          </h1>

          <p className={styles.subtitle}>
            Entre em contato para tirar dúvidas, solicitar informações ou
            conversar com nossa equipe.
          </p>

          <p className={styles.subtitle}>
            Estamos prontos para ajudar!
          </p>

          <div className={styles.ctaRow}>
            <a href="#vagas" className={styles.cta} aria-label="Ver todas as vagas">
              Ver todas as vagas
              <span className={styles.ctaIcon} aria-hidden="true">➜</span>
            </a>
          </div>
        </div>

        <div className={styles.heroWrapper}>
          <div className={styles.heroImage}></div>
        </div>
      </div>
    </section >
  );
}

