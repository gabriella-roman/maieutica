import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

import logo from "../../assets/images/logo-maieutica.svg";
import arrow from "../../assets/icons/arrow.svg";
import menu from "../../assets/icons/hamburguer-menu.svg";
import close from "../../assets/icons/close.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type HeaderProps = {
  headerBg?: string;
  headerFg?: string;
};

export function Header({ headerBg, headerFg }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const isHome = location.pathname === "/";
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Sobre Nós", path: "/about-us" },
    { label: "Nossos Serviços", path: "/our-services" },
    { label: "Fale Conosco", path: "/contact-us" },
  ];

  const headerBgColor = headerBg ?? (isHome ? "#2E7B6A" : "#ffffff");
  const headerFgColor = headerFg ?? (isHome ? "#ffffff" : "#1f2937");
  // If header is transparent, pick a sensible CTA color (brand green) so buttons remain visible
  const ctaColor = headerBgColor === "transparent" ? "#5A9E8C" : headerBgColor;

  // Update scrolled state: when on home, if user scrolls past header height, make header solid green
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 0;
      const scrolled = window.scrollY >= h;
      setIsScrolled(scrolled);
    };
    // run once to initialize
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

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


  const handleNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${isHome ? styles.merge : ""}`}
        role="banner"
        style={
          {
                ["--header-bg" as any]: (isHome && isScrolled) ? "#2E7B6A" : headerBgColor,
                ["--header-fg" as any]: (isHome && isScrolled) ? "#ffffff" : headerFgColor,
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
                    className={`${styles.link} ${location.pathname === path ? styles.active : ""}`}
                    onClick={() => handleNav(path)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
            <button className={styles.cta} onClick={() => handleNav("/job-board")} style={{
              color: ctaColor,
              borderColor: ctaColor
            }}>
              Ver Vagas
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </nav>

          <button
            ref={menuBtnRef}
            className={`${styles.menuBtn} ${isMenuOpen ? styles.menuOpen : ""}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-controls="mobileNav"
            aria-expanded={isMenuOpen}
          >
            <img src={menu} alt="Abrir menu" className={styles.iconHamburger} />
            <img src={close} alt="Fechar menu" className={styles.iconClose} />
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

          <nav className={styles.mobileNav} aria-label="menu mobile">
            {navItems.map(({ label, path }) => (
              <button
                key={path}
                className={`${styles.mobileLink} ${location.pathname === path ? styles.active : ""
                  }`}
                onClick={() => handleNav(path)}
                style={location.pathname === path ? {
                  color: headerBgColor
                } : undefined}
              >
                {label}
              </button>
            ))}

            <button
              className={`${styles.cta} ${styles.ctaMobile}`}
              onClick={() => handleNav("/job-board")}
              style={{
                color: '#ffffff',
                background: ctaColor,
                borderColor: ctaColor
              }}
            >
              VER VAGAS
              <img src={arrow} alt="" aria-hidden />
            </button>
          </nav>
        </div>
      </header>

      <div aria-hidden style={{ height: "var(--header-height)", pointerEvents: "none" }} />
    </>
  );
}
