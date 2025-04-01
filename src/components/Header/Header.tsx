import { useState, useEffect, useRef } from 'react'
import styles from './Header.module.css'
import logo from '../../assets/images/logo-maieutica.svg'
import arrow from '../../assets/icons/arrow.svg'
import menu from '../../assets/icons/menu.svg'
import close from '../../assets/icons/close.svg'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleClickOutside = (event: { target: any }) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && headerRef.current && !headerRef.current.contains(event.target)) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.header} ref={headerRef}>
      <img src={logo} alt="Logo-Maieutica" />

      <div
        className={`${styles.links} ${isMenuOpen ? styles.open : ''}`}
        ref={menuRef}
      >
        <img
          className={styles.closeIcon}
          style={{ cursor: 'pointer', alignSelf: 'flex-end' }}
          onClick={toggleMenu}
          src={close}
          alt="Close"
        />

        <a href="/" className={styles.text} onClick={() => navigate('/')}>
          HOME
        </a>
        <a href="/about-us" className={styles.text} onClick={() => navigate('/about-us')}>
          SOBRE NÓS
        </a>
        <a href="/our-services" className={styles.text} onClick={() => navigate('/our-services')}>
          NOSSOS SERVIÇOS
        </a>
        <a href="/contact-us" className={styles.text} onClick={() => navigate('/contact-us')}>
          FALE CONOSCO
        </a>

        <button className={styles.button} onClick={() => navigate('/job-board')}>
          VER VAGAS
          <img src={arrow} alt="Arrow" />
        </button>
      </div>

      <img
        style={{ cursor: 'pointer' }}
        className={styles.menuIcon}
        onClick={toggleMenu}
        src={menu}
        alt="Menu"
      />
    </div>
  )
}
