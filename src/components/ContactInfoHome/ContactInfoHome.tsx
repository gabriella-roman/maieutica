import React from "react";
import styles from "./ContactInfoHome.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEnvelope, faLocationDot, faFolder } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebookF, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

export function ContactInfoHome() {
  return (
    <section className={styles.card}>
      <div className={styles.inner}>
        {/* Coluna esquerda */}
        <div className={styles.left}>
          <h2 className={styles.title}>Fale Conosco</h2>

          <p className={styles.text}>
            Entre em contato para tirar dúvidas, solicitar informações ou conversar
            com nossa equipe. Estamos prontos para ajudar!
          </p>

          <div className={styles.infoBlock}>
            <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
            <div>
              <span className={styles.label}>E-mail</span>
              <p className={styles.valueEmail}>contato@maieuticarh.com.br</p>
            </div>
          </div>

          <div className={styles.infoBlock}>
            <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
            <div>
              <span className={styles.label}>Localização</span>
              <p className={styles.valueStrong}>São Paulo – SP</p>
            </div>
          </div>

          <div className={styles.infoBlock}>
            <FontAwesomeIcon icon={faFolder} className={styles.icon} />
            <div>
              <span className={styles.label}>CNPJ</span>
              <p className={styles.valueStrong}>32.175.487/0001-30</p>
            </div>
          </div>
        </div>

        {/* Coluna direita */}
        <p className={styles.socialTitle}>NOS ENCONTRE NAS REDES SOCIAIS</p>

        <div className={styles.socials}>
          <a href="https://www.instagram.com/maieutica.rh.educacional" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://www.facebook.com/maieuticarh" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="https://www.linkedin.com/company/maieuticarheducacional/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
        </div>
      </div>
    </section>
  );
}
