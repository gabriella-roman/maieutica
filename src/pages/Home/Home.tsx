import styles from "./Home.module.css";

import { Header } from "../../components/Header/Header";
import { BannerHome } from "../../components/BannerHome/BannerHome";
import { WhatWeDo } from "../../components/WhatWeDo/WhatWeDo";
import { ServiceItem, WhatWeDoSection } from "../../components/WhatWeDoSection/WhatWeDoSection";

export default function Home() {

  const services: ServiceItem[] = [
    {
      title: "Processos seletivos para escolas",
      description:
        "Trabalho personalizado às características da escola e realizado por psicólogos especializados em seleção de educadores.",
      href: "/our-services#processos",
      icon: <span>🎓</span>,
      colors: { accent: "#5A9E8C", iconBg: "#D7EFE7", iconFg: "#2E7B6A" },
    },
    {
      title: "Perfil psicológico",
      description:
        "Ferramenta de avaliação importantíssima na contratação de profissionais que lidam com pessoas.",
      href: "/our-services#perfil",
      icon: <span>🧠</span>,
      colors: { accent: "#D1805D", iconBg: "#F2D3C5", iconFg: "#C16E4C" },
    },
    {
      title: "Aporte – apoio e orientação na transição profissional",
      description:
        "Apoio e orientação a profissionais em desligamento ou aposentadoria, oferecido pela empresa.",
      href: "/our-services#aporte",
      icon: <span>🧭</span>,
      colors: { accent: "#E2A642", iconBg: "#F6E7C7", iconFg: "#B58425" },
    },
    {
      title: "Aconselhamento de carreira",
      description:
        "Análise, reflexão e apoio prático para carreiras profissionais em educação.",
      href: "/our-services#aconselhamento",
      icon: <span>💬</span>,
      colors: { accent: "#1F4D82", iconBg: "#D4E2F4", iconFg: "#1F4D82" },
    },
    {
      title: "ELAB – revisão e elaboração de currículo",
      description:
        "Reorganização e elaboração do currículo alinhado ao percurso e aos objetivos.",
      href: "/our-services#elab",
      icon: <span>📝</span>,
      colors: { accent: "#C26E64", iconBg: "#F1D3D0", iconFg: "#A5574F" },
    },
    {
      title: "Outplacement",
      description:
        "Apoio estruturado para recolocação profissional com foco em educação.",
      href: "/our-services#outplacement",
      icon: <span>🎯</span>,
      colors: { accent: "#7C8C4F", iconBg: "#E6ECCE", iconFg: "#6A7A3F" },
    },
  ];

  return (
    <div className={styles.page}>
      <Header />
      <BannerHome />

      <section className={styles.section}>
        <div className={styles.narrow}>
          <WhatWeDo
            badgeText="CONECTANDO PESSOAS"
            badgeIcon="✳"
            title="Confira as vagas"
            text1="Entre em contato para tirar dúvidas, solicitar informações ou conversar com nossa equipe."
            text2="Estamos prontos para ajudar!"
            showButton
            buttonLabel="Ver todas as vagas"
            buttonHref="#vagas"
            colors={{
              accent: "#CE6C39",
              badgeBg: "#EBC4B0",
              badgeFg: "#9B512B",
            }}
          />
        </div>
      </section>

      {/* Card – O que fazemos? */}
      <section className={styles.section}>
        <div className={styles.narrow}>
          <WhatWeDo
            badgeText="CONECTANDO PESSOAS"
            badgeIcon="👥"
            title="O que fazemos?"
            text1="Entre em contato para tirar dúvidas, solicitar informações ou conversar com nossa equipe."
            text2="Estamos prontos para ajudar!"
            colors={{
              accent: "#2E7B6A",
              badgeBg: "#D7EFE7",
              badgeFg: "#2E7B6A",
            }}
          />
        </div>
      </section>

      {/* Grade/Carrossel de serviços */}
        <WhatWeDoSection items={services} />
    </div>
  );
}
