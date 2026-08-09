import React from "react";
import styles from "./ContactUs.module.css";

import { Banner } from "../../components/Banner/Banner";
import { ContactInfo } from "../../components/ContactInfo/ContactInfo";
import { ContactSection } from "../../components/ContactSection/ContactSection";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";

export function ContactUs() {
  return (
    <div className={styles.page}>
      <div className={styles.contentPage}>
        <Header 
        headerBg="#d99639"
        />
        <Banner
          title="Fale conosco"
          breadcrumb={["Estamos disponíveis para atender escolas e candidatos. Fale com nossa equipe."]}
          bgColor="#d99639"
        />

        {/* Área principal */}
        <section className={styles.content}>
          <div className={styles.textColumn}>
            <h2 className={styles.title}>Ficou com alguma dúvida? Precisa de ajuda?</h2>
            <p className={styles.subtitle}>
              Fique à vontade para entrar em contato conosco, responderemos o mais breve possível.
            </p>
          </div>
          
          <div className={styles.formColumn}>
            <ContactSection />
          </div>
        </section>

        <section className={styles.contactInfo}>
          <ContactInfo />
        </section>
      </div>

      <section className={styles.footer}>
        <Footer />
      </section>
    </div>
  );
}
