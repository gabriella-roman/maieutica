import { ColoredLine } from '../../components/ColoredLine/ColoredLine'
import styles from './Footer.module.css'
import logo from '../../assets/images/logo-maieutica.svg'
import { NavbarFooter } from '../../components/NavbarFooter/NavbarFooter'

export function Footer() {
  return (
    <div className={`${styles.footer} w-100`}>
      <ColoredLine />

      <div className={`${styles.container} container-fluid`}>
        <div className="row">
          <div className="col-12 col-md-3">
            <img src={logo} alt="Logo" height={200} />
          </div>

          <div className="col-12 col-md-3">
            <NavbarFooter
              title="Serviços"
              options={[
                { title: "Processo seletivo", navigate: "/" },
                { title: "Perfil psicológico", navigate: "/" },
                { title: "Aconselhamento de carreira", navigate: "/" },
                { title: "Outplacement", navigate: "/" },
                { title: "Avaliação do idioma inglês", navigate: "/" }
              ]}
            />
          </div>

          <div className="col-12 col-md-3">
            <NavbarFooter
              title="Maiêutica RH Educacional"
              options={[
                { title: "Ver vagas", navigate: "/" },
                { title: "Fale conosco", navigate: "/contact-us" },
                { title: "Dúvidas frequentes", navigate: "/" },
                { title: "Sobre nós", navigate: "/about-us" }
              ]}
            />
          </div>

          <div className="col-12 col-md-3">
            <div style={{ marginTop: 8 }}>
              <div>
                <h1 className={styles.h1}>E-mail</h1>
                <p className={styles.p}>contato@maieuticarh.com.br</p>
              </div>

              <div>
                <h1 className={styles.h1}>Localização</h1>
                <p className={styles.p}>São Paulo - SP</p>
              </div>

              <div>
                <h1 className={styles.h1}>CNPJ</h1>
                <p className={styles.p}>32.175.487/0001-30</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.bottom} text-center py-3`}>
        <p>
          Desenvolvido por Soav Tech © Todos os direitos reservados.
        </p>

        <p>
          Soav Tech
        </p>
      </div>
    </div>
  )
}
