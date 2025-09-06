import React from "react";
import styles from "./ContactUs.module.css";

import { Banner } from "../../components/Banner/Banner";
import { ContactInfo } from "../../components/ContactInfo/ContactInfo";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";

export function ContactUs() {
  return (
    <div className={styles.page}>
      <div className={styles.contentPage}>
        <Header />

        <Banner
          title="Fale conosco"
          breadcrumb={["Home", "Fale conosco"]}
          bgColor="#d99639"
        />

        {/* Área principal */}
        <section className={styles.content}>
          {/* Coluna da esquerda (título + subtítulo) */}
          <div className={styles.left}>
            <h2 className={styles.title}>
              Ficou com alguma dúvida? Precisa de ajuda?
            </h2>

            <p className={styles.subtitle}>
              Fique à vontade para entrar em contato conosco, responderemos o
              mais breve possível.
            </p>
          </div>

          {/* Formulário (coluna da direita no desktop) */}
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* Nome */}
            <label className={styles.field}>
              <span className={styles.label}>Seu nome</span>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className={styles.input}
                  required
                  autoComplete="name"
                />
                <span
                  className={`${styles.icon} ${styles.userIcon}`}
                  aria-hidden
                />
              </div>
            </label>

            {/* E-mail + Telefone (lado a lado no desktop) */}
            <div className={styles.rowTwo}>
              <label className={styles.field}>
                <span className={styles.label}>E-mail</span>
                <div className={styles.inputWrap}>
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    className={styles.input}
                    required
                    autoComplete="email"
                  />
                  <span
                    className={`${styles.icon} ${styles.sendIcon}`}
                    aria-hidden
                  />
                </div>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Telefone</span>
                <div className={styles.inputWrap}>
                  <input
                    type="tel"
                    placeholder="Seu Telefone"
                    className={styles.input}
                    autoComplete="tel"
                  />
                  <span
                    className={`${styles.icon} ${styles.phoneIcon}`}
                    aria-hidden
                  />
                </div>
              </label>
            </div>

            {/* Mensagem */}
            <label className={styles.field}>
              <span className={styles.label}>Mensagem</span>
              <div className={styles.textareaWrap}>
                <textarea
                  placeholder="Escreva sua mensagem"
                  rows={5}
                  className={styles.textarea}
                />
                <span
                  className={`${styles.icon} ${styles.mailIcon}`}
                  aria-hidden
                />
              </div>
            </label>

            <button type="submit" className={styles.submit}>
              Enviar mensagem
            </button>
          </form>
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
