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

import ImagemFeedback from '../../assets/images/ProfessorFeedback.svg'

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
      "Mesmo não tendo sido selecionada para a vaga inicial, meu perfil profissional foi traçado com tamanho cuidado que recebi, algumas semanas mais tarde, um contato da recrutadora sobre uma vaga para a qual fui contratada. A disponibilidade, gentileza e competência da equipe da Maiêutica foram indispensáveis para minha recolocação profissional.",
    name: "Luciana",
    role: "Coord. Pedagógica",
  },
  {
    quote:
      "Primeiramente gostaria de destacar o trabalho profissional da Maiêutica em todos os momentos. Foi um processo extremamente claro, com descrição de todas as etapas desde o princípio. A Cynthia e a Larissa são extremamente profissionais e supercautelosas, minha eterna gratidão.",
    name: "Willian",
    role: "Coord. Área Tecnologia Educacional",
  },
  {
    quote:
      "Meu presente de fim de ano! Consegui o sonhado salto na minha carreira de educadora através da Maiêutica! O processo todo foi um prazer, as entrevistas super profissionais, pertinentes e respeitosas. É um orgulho adicional conseguir um novo e desejado emprego sabendo que o processo é idôneo e cuidadoso. Recomendo muito a Maiêutica!",
    name: "Ana",
    role: "Prof. Bilíngue – EF1",
  },
  {
    quote:
      "Agradeço e parabenizo o profissionalismo e trabalho realizado pela equipe da Maiêutica durante meu processo seletivo.",
    name: "Ana C.",
    role: "Prof. Bilíngue – EF1",
  },
  {
    quote:
      "Tive o prazer de participar de um processo seletivo esse ano com a Maiêutica RH Educacional e só tenho elogios ao trabalho deles. Processo humanizado, com feedbacks e evoluções das etapas. A profissional de RH Cynthia sempre muito atenciosa, me guiou em todas as etapas do processo com excelência!",
    name: "Paula",
    role: "Cargo Gestão em RH",
  },
];


  return (
    <div className={styles.page}>
  <Header headerBg="transparent" headerFg="#ffffff" />
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
