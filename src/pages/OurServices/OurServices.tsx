import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import styles from './OurServices.module.css'
import { useEffect, useState } from 'react'
import checkicon from '../../assets/icons/checkicon.svg'
import checkiconVerde from '../../assets/icons/checkicon_verde.svg'
import checkiconVermelho from '../../assets/icons/checkicon_vermelho.svg'
import checkiconAmarelo from '../../assets/icons/checkicon_amarelo.svg'
import checkiconLaranja from '../../assets/icons/checkicon_laranja.svg'
import maieuticaIconAzul from '../../assets/icons/maieutica-icon-azul.svg'
import imagem from '../../assets/images/imagens_background.png'
import imagem2 from '../../assets/images/imagens_background_2.png'
import { Banner } from '../../components/Banner/Banner'

export default function OurServices() {
  const [ativo, setAtivo] = useState<'educadores' | 'escolas'>('educadores')

  // selected sub-option: for 'educadores' -> 'aconselhamento'|'perfil'; for 'escolas' -> 'processo'|'perfil'|'aporte'
  const [selected, setSelected] = useState<'aconselhamento' | 'perfil' | 'processo' | 'aporte'>('aconselhamento')

  // responsive flag with resize listener
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  type EducadoresOpcao = {
    cor: string
    titulo: string
    subtitulo: string
    text: string
    imagem: string
  }

  type EscolasOpcao = {
    cor: string
    titulo: string
    subtitulo: string
    text: string
    imagem: string
  }

  type Opcao = {
    educadores: EducadoresOpcao
    escolas: EscolasOpcao
  }

  const opcoes: Opcao = {
    educadores: {
      cor: '#063264',
      titulo: 'Para Educadores',
      subtitulo: 'Há mais de 15 anos realizamos um trabalho especializado e personalizado às características e demandas da escola, com ética na condução do processo seletivo e total respeito aos agentes envolvidos: escola e educadores.',
      text: 'Suporte para Instituições de Ensino',
      imagem: imagem,
    },
    escolas: {
      cor: '#063264',
      titulo: 'Para Escolas',
      subtitulo: 'Há mais de 15 anos realizamos um trabalho especializado e personalizado às características e demandas da escola, com ética na condução do processo seletivo e total respeito aos agentes envolvidos: escola e educadores.',
      text: 'Suporte para Professores',
      imagem: imagem2,
    },
  }

  const atual = opcoes[ativo]

  useEffect(() => {
    if (ativo === 'educadores') setSelected('aconselhamento')
    else setSelected('processo')
  }, [ativo])


  return (
    <div className={styles.page}>
      <Header headerBg='#084385' />

      <Banner
        title="Nossos Serviços"
        breadcrumb={["Conheça as soluções que oferecemos para educadores e instituições de ensino."]}
        bgColor="#084385"
      />

      <div className={styles.sectionChoose}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIntro}>
            <h1 className={styles.sectionIntro__title}>
              {atual.titulo}
            </h1>
            <span className={styles.sectionIntro__subtitle}>
              {atual.subtitulo}
            </span>
          </div>

          <div className={styles.supportContainer}>
            <div className={styles.cardSupport}>
              <img alt='ícone maiêutica azul' src={maieuticaIconAzul} style={{ alignSelf: 'start' }} />

              <h2>
                {atual.text}
              </h2>
            </div>

            <img
              alt='imagem de fundo'
              src={atual.imagem}
              className={styles.imageSupport} />
          </div>
        </div>



        <div className={styles.sectionServices}>
          <button
            className={styles.button}
            style={{
              backgroundColor: ativo === 'educadores' ? opcoes.educadores.cor : '#ccc'
            }}
            onClick={() => {
              setAtivo('educadores')
              setSelected('aconselhamento')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
            Para Educadores
          </button>

          <img alt='ícone de separação' src={maieuticaIconAzul} style={{ alignSelf: 'center', height: 16 }} />

          <button
            className={styles.button}
            style={{
              backgroundColor: ativo === 'escolas' ? opcoes.escolas.cor : '#ccc'
            }}
            onClick={() => {
              setAtivo('escolas')
              setSelected('processo')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
            Para Escolas
          </button>
        </div>
      </div>

      <div className={styles.sectionDetails}>
        {isMobile && (
          <>
            <span>
              Serviços
            </span>

            <h1>
              {atual.titulo}
            </h1>
          </>
        )}


        <div className={styles.divider} >
          {isMobile && (
            <div className={styles.filter}>
              {ativo === 'educadores' && (
                <div className={styles.buttonArea}>
                  <button
                    className={styles.filterButton}
                    style={{
                      backgroundColor: selected === 'aconselhamento' ? '#FFFFFF' : '#E8E8E8'
                    }}
                    onClick={() => {
                      if (ativo === 'educadores') setSelected('aconselhamento')
                    }}
                  >
                    Aconselhamento de Carreira
                  </button>

                  <button
                    className={styles.filterButton}
                    style={{
                      backgroundColor: selected === 'perfil' ? '#FFFFFF' : '#E8E8E8'
                    }}
                    onClick={() => {
                      if (ativo === 'educadores') setSelected('perfil')
                    }}
                  >
                    Perfil Psicológico
                  </button>
                </div>
              )}

              {ativo === 'escolas' && (
                <div className={styles.buttonArea}>
                  <button
                    className={styles.filterButton}
                    style={{
                      backgroundColor: selected === 'processo' ? '#FFFFFF' : '#E8E8E8'
                    }}
                    onClick={() => {
                      if (ativo === 'escolas') setSelected('processo')
                    }}
                  >
                    Processo Seletivo Educacional
                  </button>

                  <button
                    className={styles.filterButton}
                    style={{
                      backgroundColor: selected === 'perfil' ? '#FFFFFF' : '#E8E8E8'
                    }}
                    onClick={() => {
                      if (ativo === 'escolas') setSelected('perfil')
                    }}
                  >
                    Perfil Psicológico
                  </button>

                  <button
                    className={styles.filterButton}
                    style={{
                      backgroundColor: selected === 'aporte' ? '#FFFFFF' : '#E8E8E8'
                    }}
                    onClick={() => {
                      if (ativo === 'escolas') setSelected('aporte')
                    }}
                  >
                    APORTE - Apoio e Orientação na Transição Profissional
                  </button>
                </div>
              )}
            </div>
          )}

          {!isMobile && (
            <div className={styles.filterDesktop}>
              <div className={styles.filter}>
                {ativo === 'educadores' && (
                  <div className={styles.buttonAreaDesktop}>
                    <button
                      className={styles.filterButtonDesktop}
                      style={{ color: selected === 'aconselhamento' ? '#084385' : '#898B8D' }}
                        onClick={() => { if (ativo === 'educadores') setSelected('aconselhamento') }}
                    >
                      Aconselhamento de Carreira
                    </button>

                    <div style={{ height: 2, backgroundColor: '#898B8D' }} />

                    <button
                      className={styles.filterButtonDesktop}
                      style={{ color: selected === 'perfil' ? '#C25450' : '#898B8D' }}
                      onClick={() => { if (ativo === 'educadores') setSelected('perfil') }}
                    >
                      Perfil Psicológico
                    </button>
                  </div>
                )}

                {ativo === 'escolas' && (
                  <div className={styles.buttonAreaDesktop}>
                    <button
                      className={styles.filterButtonDesktop}
                      style={{ color: selected === 'processo' ? '#5A9E8C' : '#898B8D' }}
                      onClick={() => { if (ativo === 'escolas') setSelected('processo') }}
                    >
                      Processo Seletivo Educacional
                    </button>

                    <div style={{ height: 2, backgroundColor: '#898B8D' }} />

                    <button
                      className={styles.filterButtonDesktop}
                      style={{ color: selected === 'perfil' ? '#CE6C39' : '#898B8D' }}
                      onClick={() => { if (ativo === 'escolas') setSelected('perfil') }}
                    >
                      Perfil Psicológico
                    </button>

                    <div style={{ height: 2, backgroundColor: '#898B8D' }} />

                    <button
                      className={styles.filterButtonDesktop}
                      style={{ color: selected === 'aporte' ? '#DFA242' : '#898B8D' }}
                      onClick={() => { if (ativo === 'escolas') setSelected('aporte') }}
                    >
                      APORTE - Apoio e Orientação na Transição Profissional
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {ativo === 'educadores' && selected === 'aconselhamento' && (
            <div className={styles.infoCard}>
              <h1 style={{
                color: '#084385'
              }}>
                Aconselhamento de carreira
              </h1>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkicon} />

                  <h3 style={{
                    color: '#084385'
                  }}>
                    O que é?
                  </h3>
                </div>

                <span>
                  É um trabalho de análise, reflexão e apoio prático para carreiras profissionais em educação.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkicon} />

                  <h3 style={{
                    color: '#084385'
                  }}>
                    O que envolve?
                  </h3>
                </div>

                <span>
                  • Levar o educador a uma reflexão sobre sua trajetória profissional <br />
                  • Analisar e discutir com o educador seu momento atual de carreira e suas intenções de futuro <br />
                  • Oferecer suporte específico e prático para revisão do currículo atual <br />
                  • Reformular o currículo <br />
                  • Oferecer feedback do mercado educacional
                </span>

                <span>
                  <strong>IMPORTANTE:</strong> O processo de aconselhamento de carreira tem compromisso de confidencialidade entre o psicólogo e o profissional.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkicon} />

                  <h3 style={{
                    color: '#084385'
                  }}>
                    No que consiste?
                  </h3>
                </div>

                <span>
                  • Duas entrevistas com psicólogo especializado no segmento educacional e clínico, com uso de instrumentos de psicologia para ampliar a análise profissional; <br />
                  • Orientações sobre como identificar sua marca pessoal e apresentar-se ao mercado de trabalho. <br />
                  • Inclusão do currículo no banco de dados da Maiêutica RH e participação nas oportunidades em aberto, desde que o perfil esteja compatível com a vaga. <br />
                </span>
              </div>
            </div>
          )}

          {ativo === 'educadores' && selected === 'perfil' && (
            <div className={styles.infoCard}>
              <h1 style={{
                color: '#C25450'
              }}>
                ELAB - revisão e elaboração de currículo
              </h1>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconVermelho} />

                  <h3 style={{
                    color: '#C25450'
                  }}>
                    O que é?
                  </h3>
                </div>

                <span>
                  É um serviço que auxilia na reorganização e elaboração de um novo currículo, de acordo com o percurso profissional do cliente e alinhado aos seus objetivos futuros.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconVermelho} style={{ height: 32 }} />

                  <h3 style={{
                    color: '#C25450'
                  }}>
                    Por que oferecer este serviço para a equipe escolar?
                  </h3>
                </div>

                <span>
                  Por meio de uma entrevista online com psicólogo especializado em RH Educacional, serão feitas, junto com o educador, uma análise do currículo atual e sugestões de mudança para a nova versão.  Ao fim do processo, o profissional recebe a nova versão do currículo com um visual atualizado desenvolvido por profissional da área de mídia.
                </span>
              </div>
            </div>
          )}

          {ativo === 'escolas' && selected === 'processo' && (
            <div className={styles.infoCard}>
              <h1 style={{
                color: '#5A9E8C'
              }}>
                Processo Seletivo Educacional
              </h1>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconVerde} />

                  <h3 style={{
                    color: '#5A9E8C'
                  }}>
                    O que fazemos?
                  </h3>
                </div>

                <span>
                  Realizamos todas as etapas do processo seletivo, desde a divulgação da vaga, a triagem dos currículos, a entrevista dos candidatos mais promissores e, por fim, o encaminhamento dos finalistas para a escola.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconVerde} style={{ height: 32 }} />

                  <h3 style={{
                    color: '#5A9E8C'
                  }}>
                    Como fazemos?
                  </h3>
                </div>

                <span>
                  <strong>Eficácia:</strong><br />
                  Nos comprometemos a continuar buscando os candidatos mais alinhados ao perfil da vaga até que a escola esteja pronta a encaminhar a contratação.<br /><br />

                  <strong>Agilidade:</strong><br />
                  O prazo pode variar conforme a complexidade da vaga e a organização interna da escola, mas buscamos enviar os candidatos finalistas dentro de até 30 dias.<br /><br />

                  <strong>Trabalho personalizado:</strong><br />
                  Cada processo seletivo é único, e nossa experiência na área educacional nos permite uma compreensão particularizada das necessidades de cada instituição na hora de definir o perfil de uma vaga.<br /><br />

                  <strong>Sigilo:</strong><br />
                  Sempre que necessário, conduzimos nossos processos seletivos com a máxima discrição, oferecendo uma opção segura quando as escolas precisam que assim seja.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconVerde} style={{ height: 32 }} />

                  <h3 style={{
                    color: '#5A9E8C'
                  }}>
                    Que tipo de vagas trabalhamos?
                  </h3>
                </div>

                <span>
                  Atuamos em todos os tipos de posições relacionadas ao segmento educacional:<br /><br />
                  <strong>Gestão:</strong> coordenadores e diretores.<br />
                  <strong>Sastrongla de aula:</strong> professores, assistentes, berçaristas.<br />
                  <strong>Apoio administrativo:</strong> secretaria, financeiro, editorial, etc.<br />
                </span>
              </div>
            </div>
          )}

          {ativo === 'escolas' && selected === 'perfil' && (
            <div className={styles.infoCard}>
              <h1 style={{
                color: '#CE6C39'
              }}>
                Perfil Psicológico
              </h1>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconLaranja} />

                  <h3 style={{
                    color: '#CE6C39'
                  }}>
                    O que é?
                  </h3>
                </div>

                <span>
                  O perfil psicológico é um serviço realizado por psicólogos competentes, que consiste na aplicação de instrumentos de avaliação das características pessoais de um profissional que estão relacionadas à sua atuação no trabalho, como por exemplo a capacidade de liderança, os valores éticos e as habilidades de comunicação.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconLaranja} style={{ height: 32 }} />

                  <h3 style={{
                    color: '#CE6C39'
                  }}>
                    Por que fazer?
                  </h3>
                </div>

                <span>
                  Boa parte do trabalho dos educadores e demais profissionais se dá no campo das relações humanas, portanto o perfil psicológico é uma ferramenta importantíssima na contratação da equipe pedagógica, pois permite conhecer mais a fundo as características pessoais de cada profissional.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconLaranja} style={{ height: 32 }} />

                  <h3 style={{
                    color: '#CE6C39'
                  }}>
                    Como é feito o tratamento de dados?
                  </h3>
                </div>

                <span>
                  O material de avaliação utilizado, bem como os dados coletados são tratados com ética e confidencialidade desde a aplicação até a compilação dos mesmos e a preparação do laudo.
                </span>
              </div>
            </div>
          )}

          {ativo === 'escolas' && selected === 'aporte' && (
            <div className={styles.infoCard}>
              <h1 style={{
                color: '#DFA242'
              }}>
                APORTE - Apoio e Orientação na Transição Profissional
              </h1>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconAmarelo} />

                  <h3 style={{
                    color: '#DFA242'
                  }}>
                    O que é?
                  </h3>
                </div>

                <span>
                  É um serviço de apoio e orientação a profissionais em momento de desligamento ou aposentadoria . Este serviço é oferecido pela empresa para a qual o profissional trabalha, como parte do pacote de desligamento.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconAmarelo} style={{ height: 32 }} />

                  <h3 style={{
                    color: '#DFA242'
                  }}>
                    Por que oferecer este serviço?
                  </h3>
                </div>

                <span>
                  No vínculo de trabalho do educador com a escola, estão depositados parte de suas crenças político-pedagógicas, os relacionamentos interpessoais desenvolvidos com a equipe e com os alunos, a apropriação do espaço físico e a dedicação ao projeto. Desta forma, o desligamento de um educador deve ser cercado de cuidado e apoio. A inclusão do serviço de APORTE sinaliza o reconhecimento e o respeito da instituição escolar pelo trabalho realizado pelo educador durante o período em que estiveram em parceria.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconAmarelo} style={{ height: 32 }} />

                  <h3 style={{
                    color: '#DFA242'
                  }}>
                    A que se propõe?
                  </h3>
                </div>

                <span>
                  • Acolher o profissional a partir do momento de desligamento da instituição;<br />
                  • Promover espaços de elaboração interna e ressignificação da mudança;<br />
                  • Auxiliar na reflexão sobre os próximos passos após o desligamento;<br />
                  • Analisar a trajetória profissional e fornecer um feedback do mercado de trabalho;<br />
                  • Fornecer orientações importantes sobre o posicionamento no mercado de trabalho, mudanças de carreira ou desenvolvimento de projeto pessoal;<br />
                  • Analisar e refazer o currículo do educador;<br />
                  • Em caso de busca por recolocação, atuar na orientação para busca e participação de processos seletivos;
                </span>

                <span>
                  O perfil psicológico não deve ser o único elemento a compor as decisões de contratação e progressão de carreira. O laudo final tem a finalidade ampliar o conhecimento a respeito do perfil do profissional, subsidiando assim a tomada de decisões mais assertivas.
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  display: 'flex',
                  gap: 8
                }}>
                  <img alt='icone check' src={checkiconAmarelo} style={{ height: 32 }} />

                  <h3 style={{
                    color: '#DFA242'
                  }}>
                    Como é realizado?
                  </h3>
                </div>

                <span>
                  São 4 encontros conduzidos por psicólogos especializados em RH Educacional, com aplicação de teste psicológico, e elaboração de relatório final para o educador, além da nova versão do currículo.
                </span>

                <span>
                  O perfil psicológico não deve ser o único elemento a compor as decisões de contratação e progressão de carreira. O laudo final tem a finalidade ampliar o conhecimento a respeito do perfil do profissional, subsidiando assim a tomada de decisões mais assertivas.
                </span>

                <span>
                  <strong>IMPORTANTE:</strong> O processo de aconselhamento de carreira tem compromisso de confidencialidade entre o psicólogo e o profissional.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className={styles.section} aria-hidden='true'>
        <Footer />
      </section>
    </div >
  )
}
