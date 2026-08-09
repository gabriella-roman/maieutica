import { Header } from "../../components/Header/Header";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import notFoundImage from "../../assets/images/404.svg";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Header headerBg="transparent" headerFg="#5A9E8C" mobileScrolledBg="#ffffff" mobileTopBg="#ffffff" mobileUseWhiteLogo={false} mobileMenuDarkIcons={true} />

      <main className={styles.content}>
        <div className={styles.panel}>

          <div className={styles.visual} aria-hidden="true">
            <img className={styles.image} src={notFoundImage} alt="" />
          </div>

          <div className={styles.copy}>
            <h1 className={styles.title}>Ops!</h1>
            <p className={styles.text}>Não encontramos essa página</p>

            <Link className={styles.backButton} to="/">
              Voltar ao inicio
              <span className={styles.backArrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}