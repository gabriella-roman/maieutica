import React from "react";
import styles from "./Section.module.css";

export interface SectionProps {
  icon?: string;
  iconColor?: string;
  iconAlt?: string;
  category: string;
  categoryColor?: string;
  title: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
}

export function Section(props: SectionProps) {
  const {
    icon,
    iconColor,
    iconAlt,
    category,
    categoryColor,
    title,
    titleColor,
    description = "",
    descriptionColor,
  } = props;

 const styleVars: React.CSSProperties = {
    "--section-bg": "#d99639",
    "--category-color": categoryColor || "#fff",
    "--title-color": titleColor || "#fff",
    "--desc-color": descriptionColor || "#fff",
  } as React.CSSProperties;

  return (
    <section className={styles.container} style={styleVars} aria-label={title}>
      <div className={styles.row}>
        {icon && (
          <img
            src={icon}
            alt={iconAlt}
            className={styles.icon}
            style={{ filter: iconColor ? `drop-shadow(0 0 0 ${iconColor})` : "" }}
          />
        )}
        <span className={styles.category}>{category}</span>
      </div>

      <h1 className={styles.title}>{title}</h1>

      {description && (
        <p
          className={styles.description}
          // permite rich text controlado
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </section>
  );
}
