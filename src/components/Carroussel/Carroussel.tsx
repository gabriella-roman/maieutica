import React from "react";
import styles from "./Carroussel.module.css";

type LogoItem = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type Props = {
  title?: string;
  badgeText?: string;
  badgeIconSrc?: string;
  items: LogoItem[];
  speedSec?: number;
  gap?: number;
};

export function Carroussel({
  title = "Nossos clientes",
  badgeText = "QUEM CONFIA",
  badgeIconSrc,
  items,
  speedSec = 26,
  gap = 56,
}: Props) {
  const styleVars: React.CSSProperties = {
    ["--duration" as any]: `${speedSec}s`,
    ["--gap" as any]: `${gap}px`,
  };

  return (
    <section className={styles.section} style={styleVars} aria-label={title}>
      <div className={styles.badge}>
        {badgeIconSrc && (
          <img src={badgeIconSrc} alt="" aria-hidden className={styles.badgeIcon} />
        )}
        <span>{badgeText}</span>
      </div>

      <h2 className={styles.title}>{title}</h2>

      <div className={styles.viewport}>
        <ul className={styles.track} aria-hidden={items.length === 0}>
          {[...items, ...items].map((logo, i) => (
            <li className={styles.item} key={`${logo.alt}-${i}`}>
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
