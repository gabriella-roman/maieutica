import React from "react";
import styles from "./AboutUs.module.css";
import { Header } from "../../components/Header/Header";
import { Banner } from "../../components/Banner/Banner";
import { Button } from "../../components/Button/Button";
import { Footer } from "../../components/Footer/Footer";
import image from "../../assets/images/professora_sobre.svg";

export default function AboutUs() {
  return (
    <div className={styles.page}>
      <div className={styles.contentPage}>
        <div className={styles.topSection}>
          <Header
            headerBg="#C25450"
          />

          <Banner
            title="Sobre nós"
            breadcrumb={["Há mais de 15 anos realizamos um trabalho especializado e personalizado às características e demandas da escola, com ética na condução"]}
            bgColor="#C25450"
          />
        </div>

        <section className={styles.layout}>
          <div className={styles.lead}>
            <h2 className={styles.ourMissionTitle}>Quem somos?</h2>
            <p className={styles.text}>
              Somos uma consultoria em RH Educacional que há mais de 15 anos
              realiza um trabalho especializado e personalizado de acordo com as
              características e demandas de cada instituição. Conduzimos os
              processos seletivos sempre de maneira ética, respeitando as
              necessidades e expectativas tanto das escolas como dos educadores.
            </p>

            <p className={styles.text}>
              Realizamos processos seletivos apenas para instituições de ensino
              e, por isso, temos um conhecimento aprofundado das necessidades
              específicas deste segmento, como as questões de calendário e as
              diferentes funções dentro de uma escola. Merece destaque ainda
              nossa vasta experiência com escolas internacionais e bilíngues, que
              enfrentam desafios particulares no momento de compor sua equipe
              pedagógica, para os quais estamos prontos a auxiliá-las.
            </p>

            <Button
              label="Nossos serviços"
              href="/services"
              accentColor="#C25450"
              onClick={() => console.log("Clicou no saiba mais")}
            />
          </div>

          <div className={styles.heroImage} aria-hidden title="Área para imagem">
            <img className={styles.image} src={image} alt="Mulher sorridente com braços cruzados" />
          </div>

          <div className={styles.mission}>
            <h2 className={styles.ourMissionTitle}>No que acreditamos</h2>
            <p className={styles.ourMissionText}>
              Embora as ferramentas digitais sejam hoje indispensáveis, acreditamos
              fortemente na importância da experiência de profissionais qualificados
              para a condução de um processo seletivo bem sucedido. Por isso
              oferecemos um serviço especializado, com comprometimento total ao
              alinhamento entre o perfil definido pela instituição e as expectativas
              dos educadores. Além disso, acreditamos no valor de cada profissional
              e baseamos nosso trabalho na ética e no respeito por cada candidato.
            </p>
          </div>
        </section>
      </div>

      <section className={styles.footer}>
        <Footer />
      </section>
    </div>
  );
}
