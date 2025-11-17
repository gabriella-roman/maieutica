import React from "react";
import styles from "./Banner.module.css";

export interface BannerProps {
  title: string;
  breadcrumb: string[]; 
  bgColor?: string; 
  textColor?: string;
  maxWidth?: string | number;
  radius?: number;
}

export function Banner({
  title,
  breadcrumb,
  bgColor,
  textColor,
  maxWidth,
  radius,
}: BannerProps) {
  const styleVars: React.CSSProperties = {
    // @ts-expect-error custom props for CSS vars
    "--banner-bg": bgColor || "#d99639",
    "--banner-text": textColor || "#fff",
    "--banner-max": typeof maxWidth === "number" ? `${maxWidth}px` : (maxWidth || "1120px"),
    "--banner-radius": radius ? `${radius}px` : undefined,
  };

  return (
    <section className={styles.container} style={styleVars}>
      <div className={styles.innerContent}>
        <h1 className={styles.title}>{title}</h1>

        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          {breadcrumb.map((item, index) => (
            <span key={index}>
              {item}
              {index < breadcrumb.length - 1 && (
                <span className={styles.separator}>›</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
