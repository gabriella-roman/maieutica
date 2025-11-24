import styles from "./Home.module.css"

import { Header } from "../../components/Header/Header"
import { BannerHome } from "../../components/BannerHome/BannerHome"
import { WhatWeDo } from "../../components/WhatWeDo/WhatWeDo"
import { Carroussel } from "../../components/Carroussel/Carroussel"
import { ServiceItem, WhatWeDoSection } from "../../components/WhatWeDoSection/WhatWeDoSection"
import stackBooks from "../../assets/icons/stack-of-books 1.svg"
import StatsSection from "../../components/StatsSection/StatsSection"
import Testimonials from "../../components/Testimonials/Testimonials"
import { ContactInfoHome } from "../../components/ContactInfoHome/ContactInfoHome"
import { ContactSection } from "../../components/ContactSection/ContactSection"
import { Footer } from "../../components/Footer/Footer"
import BoardVagas from '../../components/BoardVagas/BoardVagas';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes, faGraduationCap, faBrain, faCompass, faComments, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import connectPeople from '../../assets/icons/icon_connectpeople.svg'
import schoolIcon from '../../assets/icons/school.svg'

import ImagemFeedback from '../../assets/images/Mask group.svg'

export default function Home() {
  const services: ServiceItem[] = [
    {
      title: "Processos seletivos para escolas",
      description:
        "Trabalho personalizado às características da escola e realizado por psicólogos especializados em seleção de educadores.",
      href: "/our-services#processos",
      icon: <FontAwesomeIcon icon={faGraduationCap} />,
      colors: { accent: "#5A9E8C", iconBg: "#D7EFE7", iconFg: "#2E7B6A" },
    },
    {
      title: "Perfil psicológico",
      description:
        "Ferramenta de avaliação importantíssima na contratação de profissionais que lidam com pessoas.",
      href: "/our-services#perfil",
      icon: <FontAwesomeIcon icon={faBrain} />,
      colors: { accent: "#D1805D", iconBg: "#F2D3C5", iconFg: "#C16E4C" },
    },
    {
      title: "Aporte – apoio e orientação na transição profissional",
      description:
        "Apoio e orientação a profissionais em desligamento ou aposentadoria, oferecido pela empresa.",
      href: "/our-services#aporte",
      icon: <FontAwesomeIcon icon={faCompass} />,
      colors: { accent: "#E2A642", iconBg: "#F6E7C7", iconFg: "#B58425" },
    },
    {
      title: "Aconselhamento de carreira",
      description:
        "Análise, reflexão e apoio prático para carreiras profissionais em educação.",
      href: "/our-services#aconselhamento",
      icon: <FontAwesomeIcon icon={faComments} />,
      colors: { accent: "#1F4D82", iconBg: "#D4E2F4", iconFg: "#1F4D82" },
    },
    {
      title: "ELAB – revisão e elaboração de currículo",
      description:
        "Reorganização e elaboração do currículo alinhado ao percurso e aos objetivos.",
      href: "/our-services#elab",
      icon: <FontAwesomeIcon icon={faPenToSquare} />,
      colors: { accent: "#C26E64", iconBg: "#F1D3D0", iconFg: "#A5574F" },
    },
  ]

  const logos: { src: string; alt: string }[] = [];
  const req = (require as any).context("../../assets/logos", false, /\.(png|jpe?g|svg)$/i);
  const keys: string[] = req.keys();
  keys.forEach((k, i) => {
    const mod = req(k);
    const src = mod && mod.default ? mod.default : mod;
    const name = k.replace(/^\.\//, "");
    logos.push({ src, alt: name });
  });

  const feedbacks = [
    {
      quote:
        "Graças à Maieutica RH, consegui uma oportunidade que tem tudo a ver com meu perfil. O processo foi rápido e bem organizado. Recomendo para quem quer algo prático e eficiente!",
      name: "João Trajano",
      role: "Professor de História",
      avatar: "https://i.pravatar.cc/112?img=15",
    },
    {
      quote:
        "Equipe atenciosa e comunicação muito clara. Em poucos dias eu já estava em entrevistas.",
      name: "Marina Souza",
      role: "Coordenadora Pedagógica",
      avatar: "https://i.pravatar.cc/112?img=5",
    },
    {
      quote:
        "Processo seletivo objetivo e respeitoso. Me senti acompanhado o tempo todo.",
      name: "Rafael Martins",
      role: "Professor de Matemática",
      avatar: "https://i.pravatar.cc/112?img=8",
    },
  ]

  return (
    <div className={styles.page}>
      <Header />
      <BannerHome />
      <section className={styles.section}>
        <div className={styles.whatRow}>
          <WhatWeDo
          badgeText="CONECTANDO PESSOAS"
          badgeIcon={<img src={connectPeople} alt="Ícone conectando pessoas" />}
          title="Confira as vagas"
          text1="Entre em contato para tirar dúvidas, solicitar informações ou conversar com nossa equipe."
          text2="Estamos prontos para ajudar!"
          buttonLabel="Ver todas as vagas"
          buttonHref="#vagas"
          colors={{
            accent: "#CE6C39",
            badgeBg: "#EBC4B0",
            badgeFg: "#9B512B",
          }}
        />

        <BoardVagas limit={4} />
        </div>
      </section>

      <div className={styles.sectionWWDS}>
        <WhatWeDoSection items={services} />
        <Carroussel badgeIconSrc={stackBooks} items={logos} title="Nossos clientes"/>
      </div>


      <StatsSection />

      <section className={styles.sectionFeedback} id="vagas">
        <div className={styles.feedbackHeading}>
          <WhatWeDo
            badgeText="CONECTANDO PESSOAS"
            badgeIcon={<img src={schoolIcon} alt="Ícone escola" />}
            title="Feedback dos profissionais"
            showButton={false}
            text1=""
            text2=""
            colors={{
              accent: "var(--color-maieutica-azul)",
              badgeBg: "var(--color-white)",
              badgeFg: "var(--color-maieutica-azul)",
            }}
          />
        </div>

        <div className={styles.feedbackRow}>
          <img alt='' src={ImagemFeedback} className={styles.feedbackMedia} role="img" aria-label="Foto ilustrativa" />
          <div className={styles.feedbackCard}>
            <Testimonials items={feedbacks} title="" />
          </div>
        </div>
      </section>

      <section className={styles.sectionContact} aria-hidden="true">
        <ContactInfoHome />
        <ContactSection />


      </section>

      <Footer />
    </div>
  )
}
