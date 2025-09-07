import React from "react";
import styles from "./ServiceCard.module.css";

type Colors = {
  accent?: string;
  iconBg?: string;
  iconFg?: string;
  text?: string;
};

type ServiceCardProps = {
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  colors?: Colors;
  ctaLabel?: string;
};

export function ServiceCard({
  title,
  description,
  href,
  onClick,
  icon,
  colors,
  ctaLabel = "Saiba mais",
}: ServiceCardProps) {
  const styleVars: React.CSSProperties = {
    ["--svc-accent" as any]: colors?.accent ?? "#5A9E8C",
    ["--svc-icon-bg" as any]: colors?.iconBg ?? "#D7EFE7",
    ["--svc-icon-fg" as any]: colors?.iconFg ?? "#2E7B6A",
    ["--svc-text" as any]: colors?.text ?? "#5C5E5F",
  };


  const DefaultIcon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 12v4c3 2 9 2 12 0v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const CTA = href ? (
    <a className={styles.cta} href={href}>
      {ctaLabel}
      <span aria-hidden className={styles.arrow}>›</span>
    </a>
  ) : (
    <button className={`${styles.cta} ${styles.ctaBtn}`} onClick={onClick} type="button">
      {ctaLabel}
      <span aria-hidden className={styles.arrow}>›</span>
    </button>
  );

  return (
    <section className={styles.card} style={styleVars}>
      <div className={styles.iconWrap} aria-hidden>
        <span className={styles.icon}>{icon ?? DefaultIcon}</span>
      </div>

      <h3 className={styles.title}>{title}</h3>

      <p className={styles.description}>{description}</p>

      {CTA}
    </section>
  );
}
