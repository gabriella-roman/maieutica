import { ColoredLine } from "../../components/ColoredLine/ColoredLine";
import styles from "./Footer.module.css";
import logo from "../../assets/images/logo-maieutica.svg";
import { NavbarFooter } from "../../components/NavbarFooter/NavbarFooter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebookF, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { Fragment } from "react";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <ColoredLine />

      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.colLogo}>
            <img src={logo} alt="Maiêutica RH Educacional" height={156} />
          </div>

          <div className={styles.col}>
            <NavbarFooter
              title="Serviços"
              options={[
                { title: "Processo seletivo", navigate: "/" },
                { title: "Perfil psicológico", navigate: "/" },
                { title: "Aconselhamento de carreira", navigate: "/" },
                { title: "Outplacement", navigate: "/" },
                { title: "Avaliação do idioma inglês", navigate: "/" },
              ]}
            />
          </div>

          <div className={styles.col}>
            <NavbarFooter
              title="Maiêutica RH Educacional"
              options={[
                { title: "Ver vagas", navigate: "/job-board" },
                { title: "Fale conosco", navigate: "/contact-us" },
                { title: "Dúvidas frequentes", navigate: "/" },
                { title: "Sobre nós", navigate: "/about-us" },
              ]}
            />
          </div>

          <div className={styles.colRight}>
            <div className={styles.infoGroup}>
              <h3 className={styles.h1}>E-mail</h3>
              <p className={styles.p}>contato@maieuticarh.com.br</p>
            </div>

            <div className={styles.infoGroup}>
              <h3 className={styles.h1}>Localização</h3>
              <p className={styles.p}>São Paulo – SP</p>
            </div>

            <div className={styles.infoGroup}>
              <h3 className={styles.h1}>CNPJ</h3>
              <p className={styles.p}>32.175.487/0001-30</p>
            </div>

            <div className={styles.socials}>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p>Desenvolvido por Soav Tech © Todos os direitos reservados.</p>
          <p className={styles.brandRight}>Soav Tech</p>
        </div>
      </div>
    </footer>
  );
}
