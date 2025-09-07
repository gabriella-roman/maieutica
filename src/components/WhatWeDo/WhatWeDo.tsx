import React from "react";
import styles from "./WhatWeDo.module.css";

type Colors = {
  cardBg?: string;
  text?: string;
  accent?: string; 
  badgeBg?: string;
  badgeFg?: string;
};

type WhatWeDoProps = {
  title: string;
  text1?: string;
  text2?: string;
  badgeText: string;
  badgeIcon?: React.ReactNode; 
  showButton?: boolean;
  buttonLabel?: string;
  buttonHref?: string; 
  onButtonClick?: () => void;
  colors?: Colors;
};

export function WhatWeDo({
  title,
  text1,
  text2,
  badgeText,
  badgeIcon,
  showButton = false,
  buttonLabel = "Ver todas as vagas",
  buttonHref,
  onButtonClick,
  colors,
}: WhatWeDoProps) {
  const styleVars: React.CSSProperties = {
    // defaults
    ["--card-bg" as any]: colors?.cardBg ?? "#ffffff",
    ["--text" as any]: colors?.text ?? "#5C5E5F",
    ["--accent" as any]: colors?.accent ?? "#CE6C39",
    ["--badge-bg" as any]: colors?.badgeBg ?? "#D7EFE7",
    ["--badge-fg" as any]: colors?.badgeFg ?? "#2E7B6A",
  };

  const CTA = showButton
    ? buttonHref
      ? (
        <a href={buttonHref} className={styles.ctaOutline}>
          {buttonLabel}
          <span className={styles.arrow} aria-hidden>›</span>
        </a>
      )
      : (
        <button type="button" className={`${styles.ctaOutline} ${styles.ctaButton}`} onClick={onButtonClick}>
          {buttonLabel}
          <span className={styles.arrow} aria-hidden>›</span>
        </button>
      )
    : null;

  return (
    <section className={styles.card} style={styleVars} aria-labelledby="wwd-title">
      <div className={styles.badge}>
        {badgeIcon && <span className={styles.badgeIcon} aria-hidden>{badgeIcon}</span>}
        <span>{badgeText}</span>
      </div>

      <h2 id="wwd-title" className={styles.title}>{title}</h2>

      {text1 && <p className={styles.text}>{text1}</p>}
      {text2 && <p className={styles.text}>{text2}</p>}

      {CTA}
    </section>
  );
}
