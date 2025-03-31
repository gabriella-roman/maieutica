import styles from './Header.module.css'
import logo from '../../assets/images/logo-maieutica.svg'
import arrow from '../../assets/icons/arrow.svg'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()

  return (
    <div className={`${styles.header} navbar navbar-expand-lg navbar-light bg-light`}>
      <div className="container-fluid">
        {/* Logo */}
        <img src={logo} alt="Logo-Maieutica" className="navbar-brand" />

        {/* Toggle Button para Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links de Navegação */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className={`${styles.links} navbar-nav ms-auto`}>
            <a className={`${styles.text} nav-link`} onClick={() => navigate('/')}>
              HOME
            </a>
            <a className={`${styles.text} nav-link`} onClick={() => navigate('/about-us')}>
              SOBRE NÓS
            </a>
            <a className={`${styles.text} nav-link`} onClick={() => navigate('/our-services')}>
              NOSSOS SERVIÇOS
            </a>
            <a className={`${styles.text} nav-link`} onClick={() => navigate('/contact-us')}>
              FALE CONOSCO
            </a>


            <button
              className={`${styles.button} btn`}
              onClick={() => navigate('/job-board')}
            >
              VER VAGAS
              <img src={arrow} alt="Arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
