import { Header } from '../../components/Header/Header'
import { BannerHome } from '../../components/BannerHome/BannerHome'
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
import SectionHeader from '../../components/SectionHeader/SectionHeader'

export default function OurServices() {
  const [ativo, setAtivo] = useState<"educadores" | "escolas">("educadores")

  const [aconselhamentoDeCarreira, setAconselhamentoDeCarreira] = useState(ativo === 'educadores' ? true : false)
  const [perfilPsicologicoEducadores, setPerfilPsicologico] = useState(false)

  const [processoSeletivoEducacional, setProcessoSeletivoEducacional] = useState(false)
  const [perfilPsicologicoEscolas, setPerfilPsicologicoEscolas] = useState(ativo === 'escolas' ? true : false)
  const [aporte, setAporte] = useState(false)

  type EducadoresOpcao = {
    cor: string
    titulo: string
    subtitulo: string
    aconselhamentoDeCarreira: boolean
    perfilPsicologico: boolean
  }

  type EscolasOpcao = {
    cor: string
    titulo: string
    subtitulo: string
    processoSeletivoEducacional: boolean
    perfilPsicologico: boolean
    aporte: boolean
  }

  type Opcao = {
    educadores: EducadoresOpcao
    escolas: EscolasOpcao
  }

  const opcoes: Opcao = {
    educadores: {
      cor: "#063264",
      titulo: "Para Educadores",
      subtitulo: "Recursos e materiais para professores",
      aconselhamentoDeCarreira: aconselhamentoDeCarreira,
      perfilPsicologico: perfilPsicologicoEducadores,
    },
    escolas: {
      cor: "#063264",
      titulo: "Para Escolas",
      subtitulo: "Ferramentas e suporte institucional",
      processoSeletivoEducacional: processoSeletivoEducacional,
      perfilPsicologico: perfilPsicologicoEscolas,
      aporte: aporte,
    },
  }

  const atual = opcoes[ativo]

  useEffect(() => {
    if (ativo === 'educadores') {
      setAconselhamentoDeCarreira(true)
      setPerfilPsicologico(false)
      setProcessoSeletivoEducacional(false)
      setPerfilPsicologicoEscolas(false)
      setAporte(false)
    } else if (ativo === 'escolas') {
      setProcessoSeletivoEducacional(true)
      setPerfilPsicologicoEscolas(false)
      setAconselhamentoDeCarreira(false)
      setPerfilPsicologico(false)
      setAporte(false)
    }
  }, [ativo])


  return (
    <div className={styles.page}>
      <Header />

      <SectionHeader
        title='Nossos Serviços'
        subtitle='Conheça as soluções que oferecemos para educadores e instituições de ensino.'
        backgroundColor='#084385'
      />

      <div className={styles.sectionIntro}>
        <h1 className={styles.sectionIntro__title}>
          Para Escolas
        </h1>
        <span className={styles.sectionIntro__subtitle}>
          Há mais de 15 anos realizamos um trabalho especializado e personalizado às características e demandas da escola, com ética na condução do processo seletivo e total respeito aos agentes envolvidos: escola e educadores.
        </span>
      </div>


      <div style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#063264',
        color: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        margin: 24,
        gap: 64
      }}>
        <img alt='ícone maiêutica azul' src={maieuticaIconAzul} style={{ alignSelf: 'start' }} />

        <h2>
          Suporte para Instituições de ensino
        </h2>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        margin: 24
      }}>
        <img alt='imagem de fundo' src={imagem} style={{ borderRadius: 16 }} />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24
      }}>
        <button
          onClick={() => setAtivo('educadores')}
          style={{
            borderRadius: 64,
            border: 'none',
            backgroundColor: ativo === 'educadores' ? opcoes.educadores.cor : '#ccc',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}>
          Para Educadores
        </button>

        <button
          onClick={() => setAtivo('escolas')}
          style={{
            display: 'flex',
            borderRadius: 64,
            border: 'none',
            backgroundColor: ativo === 'escolas' ? opcoes.escolas.cor : '#ccc',
            color: '#FFFFFF',
            fontSize: '16px',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            minWidth: 100
          }}>
          Para Escolas
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 32,
        }}>
        <span>
          Serviços
        </span>

        <h1>
          {atual.titulo}
        </h1>

        {/* filtro */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            padding: '16px 24px',
            whiteSpace: 'nowrap',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {ativo === 'educadores' && (
            <div style={{
              backgroundColor: '#E8E8E8',
              borderRadius: 16,
              border: '1px solid #898B8D',
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}>
              <button
                onClick={() => {
                  if (ativo === 'educadores') {
                    setAconselhamentoDeCarreira(true)
                    setPerfilPsicologico(false)
                    setProcessoSeletivoEducacional(false)
                    setPerfilPsicologicoEscolas(false)
                    setAporte(false)
                  }
                }}
                style={{
                  backgroundColor: aconselhamentoDeCarreira ? '#FFFFFF' : '#E8E8E8',
                  color: '#5C5E5F',
                  border: 'none',
                  borderRadius: 16,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  flex: '0 0 auto'
                }}
              >
                Aconselhamento de Carreira
              </button>

              <button
                onClick={() => {
                  if (ativo === 'educadores') {
                    setAconselhamentoDeCarreira(false)
                    setPerfilPsicologico(true)
                    setProcessoSeletivoEducacional(false)
                    setPerfilPsicologicoEscolas(false)
                    setAporte(false)
                  }
                }}
                style={{
                  backgroundColor: perfilPsicologicoEducadores ? '#FFFFFF' : '#E8E8E8',
                  color: '#5C5E5F',
                  border: 'none',
                  borderRadius: 16,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  flex: '0 0 auto'
                }}
              >
                Perfil Psicológico
              </button>
            </div>
          )}

          {ativo === 'escolas' && (
            <div style={{
              backgroundColor: '#E8E8E8',
              borderRadius: 16,
              border: '1px solid #898B8D',
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}>
              <button
                onClick={() => {
                  if (ativo === 'escolas') {
                    setAconselhamentoDeCarreira(false)
                    setPerfilPsicologico(false)
                    setProcessoSeletivoEducacional(true)
                    setPerfilPsicologicoEscolas(false)
                    setAporte(false)
                  }
                }}
                style={{
                  backgroundColor: processoSeletivoEducacional ? '#FFFFFF' : '#E8E8E8',
                  color: '#5C5E5F',
                  border: 'none',
                  borderRadius: 16,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  flex: '0 0 auto'
                }}
              >
                Processo Seletivo Educacional
              </button>

              <button
                onClick={() => {
                  if (ativo === 'escolas') {
                    setAconselhamentoDeCarreira(false)
                    setPerfilPsicologico(false)
                    setProcessoSeletivoEducacional(false)
                    setPerfilPsicologicoEscolas(true)
                    setAporte(false)
                  }
                }}
                style={{
                  backgroundColor: perfilPsicologicoEscolas ? '#FFFFFF' : '#E8E8E8',
                  color: '#5C5E5F',
                  border: 'none',
                  borderRadius: 16,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  flex: '0 0 auto'
                }}
              >
                Perfil Psicológico
              </button>

              <button
                onClick={() => {
                  if (ativo === 'escolas') {
                    setAconselhamentoDeCarreira(false)
                    setPerfilPsicologico(false)
                    setProcessoSeletivoEducacional(false)
                    setPerfilPsicologicoEscolas(false)
                    setAporte(true)
                  }
                }}
                style={{
                  backgroundColor: aporte ? '#FFFFFF' : '#E8E8E8',
                  color: '#5C5E5F',
                  border: 'none',
                  borderRadius: 16,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  flex: '0 0 auto'
                }}
              >
                APORTE - Apoio e Orientação na Transição Profissional
              </button>
            </div>
          )}
        </div>

        {ativo === 'educadores' && opcoes.educadores.aconselhamentoDeCarreira && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 32,
            margin: 24,
            gap: 24
          }}>
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

        {ativo === 'educadores' && opcoes.educadores.perfilPsicologico && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 32,
            margin: 24,
            gap: 24
          }}>
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

        {ativo === 'escolas' && opcoes.escolas.processoSeletivoEducacional && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 32,
            margin: 24,
            gap: 24
          }}>
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

        {ativo === 'escolas' && opcoes.escolas.perfilPsicologico && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 32,
            margin: 24,
            gap: 24
          }}>
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

        {ativo === 'escolas' && opcoes.escolas.aporte && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 32,
            margin: 24,
            gap: 24
          }}>
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

      <section className={styles.section} aria-hidden='true'>
        <Footer />
      </section>
    </div >
  )
}
