import { ColoredLine } from '../../components/ColoredLine/ColoredLine'
import styles from './Footer.module.css'
import logo from '../../assets/images/logo-maieutica.svg'
import { NavbarFooter } from '../../components/NavbarFooter/NavbarFooter'
import instagram from '../../assets/icons/instagram.svg'
import facebook from '../../assets/icons/facebook.svg'
import linkedin from '../../assets/icons/linkedin.svg'

export function Footer() {
  return (
    <div className={styles.footer}>
      <ColoredLine />

      <div className={styles.container}>
        <div>
          <img src={logo} alt="Logo" height={200} />
        </div>

        <div className={styles.box}>
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

        <div className={styles.box}>
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

        <div>
          <h1 className={styles.title}>
            Contato
          </h1>
          <div className={styles.box}>
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

            <div className={styles.icons}>
              <img src={instagram} alt="Instagram" />

              <img src={facebook} alt="Facebook" />

              <img src={linkedin} alt="Linkedin" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.p}>
          Desenvolvido por Soav Tech © Todos os direitos reservados.
        </p>

        <p className={styles.p}>
          Soav Tech
        </p>
      </div>
    </div>
  )
}
