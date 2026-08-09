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
          <Header headerBg="transparent" headerFg="#ffffff" mobileScrolledBg="#C25450" />

          <Banner
            title="Sobre nós"
            breadcrumb={["Conectamos instituições educacionais e educadores por meio de processos seletivos especializados, éticos e humanizados."]}
            bgColor="#C25450"
          />
        </div>

        <section className={styles.layout}>
          <div className={styles.lead}>
            <h2 className={styles.ourMissionTitle}>Quem somos?</h2>
            <p className={styles.text}>
              Somos uma consultoria especializada em <b>RH Educacional</b>, com mais de
              <b>18 anos de experiência</b> na condução de processos seletivos
              personalizados para instituições de ensino.
            </p>

            <p className={styles.text}>
              Atuamos de forma <b>ética, estratégica e sensível</b>, considerando as
              características, os valores e as necessidades de cada escola, assim
              como as expectativas e trajetórias dos educadores.
            </p>

            <p className={styles.text}>
              Por trabalharmos <b>exclusivamente com o setor educacional</b>, temos um
              olhar aprofundado sobre suas especificidades - diferentes
              calendários, funções e contextos pedagógicos. Acumulamos ampla
              experiência com escolas nacionais, internacionais e bilíngues,
              apoiando a formação de equipes alinhadas à cultura institucional e
              aos desafios da educação contemporânea.
            </p>

            <Button
              label="Nossos serviços"
              href="/our-services"
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
              Acreditamos que, mesmo com o avanço das ferramentas digitais de
              seleção, <b>o olhar humano e a experiência profissional</b> continuam sendo
              essenciais para um processo seletivo de qualidade.
            </p>

            <p className={styles.ourMissionText}>
              Oferecemos um serviço <b>especializado e cuidadoso</b>, comprometido com o
              alinhamento entre o <b>perfil buscado</b> pela instituição e as
              expectativas, valores e trajetórias dos educadores.
            </p>

            <p className={styles.ourMissionText}>
              Valorizamos cada profissional envolvido no processo e pautamos nosso
              trabalho na <b>ética, no respeito e na escuta </b>.
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
