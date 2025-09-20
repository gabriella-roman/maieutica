import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

import logo from "../../assets/images/logo-maieutica.svg";
import arrow from "../../assets/icons/arrow.svg";
import menu from "../../assets/icons/menu.svg";
import close from "../../assets/icons/close.svg";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const isHome = location.pathname === "/";
  const headerBg = isHome ? "#2E7B6A" : "#ffffff";
  const headerFg = isHome ? "#ffffff" : "#1f2937";

  useEffect(() => {
    if (!headerRef.current) return;
    const setHeight = () => {
      const h = headerRef.current!.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isMenuOpen) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || menuBtnRef.current?.contains(t)) return;
      setIsMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(v => !v);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Sobre Nós", path: "/about-us" },
    { label: "Nossos Serviços", path: "/our-services" },
    { label: "Fale Conosco", path: "/contact-us" },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${isHome ? styles.merge : ""}`}
      role="banner"
      style={
        {
          ["--header-bg" as any]: headerBg,
          ["--header-fg" as any]: headerFg,
        } as React.CSSProperties
      }
    >
      <div className={styles.inner}>
        <button
          className={styles.brand}
          onClick={() => handleNav("/")}
          aria-label="Ir para a página inicial"
        >
          <img src={logo} alt="Maiêutica RH Educacional" />
        </button>

        <nav className={styles.nav} aria-label="principal">
          <ul className={styles.navList}>
            {navItems.map(({ label, path }) => (
              <li key={path}>
                <button
                  className={`${styles.link} ${location.pathname === path ? styles.active : ""
                    }`}
                  onClick={() => handleNav(path)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <button className={styles.cta} onClick={() => handleNav("/job-board")}>
            VER VAGAS
            <img src={arrow} alt="" aria-hidden />
          </button>
        </nav>

        <button
          ref={menuBtnRef}
          className={styles.menuBtn}
          onClick={toggleMenu}
          aria-label="Abrir menu"
          aria-controls="mobileNav"
          aria-expanded={isMenuOpen}
        >
          <img src={menu} alt="" />
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.backdrop} onClick={() => setIsMenuOpen(false)} />
      )}

      <div
        id="mobileNav"
        ref={menuRef}
        className={`${styles.mobilePanel} ${isMenuOpen ? styles.open : ""}`}
      >
        <div className={styles.mobileHeader}>
          <img src={logo} alt="Maiêutica RH Educacional" />
          <button className={styles.closeBtn} onClick={toggleMenu} aria-label="Fechar menu">
            <img src={close} alt="" />
          </button>
        </div>

        <nav className={styles.mobileNav} aria-label="menu mobile">
          {navItems.map(({ label, path }) => (
            <button
              key={path}
              className={`${styles.mobileLink} ${location.pathname === path ? styles.active : ""
                }`}
              onClick={() => handleNav(path)}
            >
              {label}
            </button>
          ))}

          <button
            className={`${styles.cta} ${styles.ctaMobile}`}
            onClick={() => handleNav("/job-board")}
          >
            VER VAGAS
            <img src={arrow} alt="" aria-hidden />
          </button>
        </nav>
      </div>
    </header>
  );
}
