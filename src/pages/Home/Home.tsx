import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom'
import arrow from '../../assets/icons/arrow.svg'
import { Section } from '../../components/Section/Section'
import people from '../../assets/icons/people.svg'
import { SectionFeedback } from '../../components/SectionFeedback/SectionFeedback'
import { InfoCard } from '../../components/InfoCard/InfoCard'
import education from '../../assets/icons/school-1.svg'
import psychology from '../../assets/icons/psychology.svg'
import language from '../../assets/icons/language.svg'
import transition from '../../assets/icons/diversity.svg'
import help from '../../assets/icons/help.svg'
import { JobBoard } from '../../components/JobBoard/JobBoard'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            há 15 anos buscando os melhores educadores
          </h1>

          <button
            className={styles.button}
            onClick={() => navigate('/job-board')}
          >
            Ver todas as vagas

            <img src={arrow} alt='Arrow' />
          </button>
        </div>

        <img className={styles.image} alt='Grupo de pessoas' />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '24px',
        padding: '64px 72px',
      }}>
        <div style={{
          gap: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: 64,
          paddingLeft: 72,
          paddingRight: 72
        }}>
          <Section
            category='CONECTANDO PESSOAS'
            categoryColor='rgba(90, 158, 140, 1)'
            title='Confira as vagas'
            titleColor='rgba(206, 108, 57, 1)'
            description='Entre em contato para tirar dúvidas, solicitar informações ou conversar com nossa equipe.<br/><br/> Estamos prontos para ajudar!'
            descriptionColor='rgba(114, 114, 114, 1)'
          />

          <button
            className={styles.button2}
            onClick={() => navigate('/job-board')}
          >
            Ver todas as vagas

            <img src={arrow} alt='Arrow' />
          </button>
        </div>
        <JobBoard />
      </div>
      <div id='teste' style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        padding: '64px 72px',
      }}>
        <Section
          icon={people}
          iconAlt='Ícone de pessoas'
          category='CONECTANDO PESSOAS'
          categoryColor='rgba(90, 158, 140, 1)'
          title='O que fazemos?'
          titleColor='rgba(90, 158, 140, 1)'
        />

        <InfoCard
          color='rgba(90, 158, 140, 1)'
          icon={education}
          text='PROCESSOS SELETIVOS PARA ESCOLAS'
          description='Trabalho personalizado às características da escola e realizado por psicólogos especializados em seleção de educadores.'
          link='/job-board'
        />
        <InfoCard
          color='#E66B2B'
          icon={psychology}
          text='PERFIL PSICOLÓGICO'
          description='É uma ferramenta de avaliação importantíssima na contratação de profissionais que lidam com pessoas.'
          link='/profile-assessment'
        />

        <InfoCard
          color='#004182'
          icon={language}
          text='AVALIAÇÃO DE FLUÊNCIA DO IDIOMA INGLÊS'
          description='Analisamos a habilidade no idioma considerando fluência, compreensão, pronúncia e contexto, auxiliando no aprimoramento contínuo'
          link='/language-assessment'
        />
        <InfoCard
          color='#F6A623'
          icon={transition}
          text='APOIO À TRANSIÇÃO PROFISSIONAL (outplacement)'
          description='Acolhemos e orientamos o profissional no momento sempre difícil do desligamento ou aposentadoria.'
          link='/career-transition'
        />
        <InfoCard
          color='#E66464'
          icon={help}
          text='APOIO À TRANSIÇÃO PROFISSIONAL (outplacement)'
          description='Reflexão sobre sua carreira e intenções futuras, revisão do seu currículo e feedback sobre você e o mercado educacional.'
          link='/career-transition'
        />
      </div>

      <div
        style={{
          gap: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: 64,
          paddingLeft: 72,
          paddingRight: 72
        }}
      >

      </div>

      <div style={{
        gap: 18,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 64,
        paddingLeft: 72,
        paddingRight: 72
      }}>
        <Section
          icon={education}
          iconColor='rgba(29, 66, 44, 1)'
          iconAlt='Ícone de educação'
          category='CONECTANDO PESSOAS'
          categoryColor='rgba(29, 66, 44, 1)'
          title='Feedback dos profissionais'
          titleColor='rgba(206, 108, 57, 1)'
        />

        <div className={styles.feedbackContainer}>
          <img
            alt='Imagem'
            style={{
              width: 550,
              objectFit: 'cover',
              borderRadius: 30
            }} />

          <SectionFeedback />
        </div>
      </div>
      <Footer />
    </div>
  )
}
