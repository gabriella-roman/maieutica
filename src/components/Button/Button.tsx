import React from "react";
import styles from "./Button.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export interface ButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  accentColor?: string;
};

export function Button(props: ButtonProps) {
  const {label, href, onClick, fullWidth, accentColor} = props;
  const classes = `${styles.button} ${fullWidth ? styles.full : ''}`.trim();
  const style = accentColor
    ? ({ borderColor: accentColor, color: accentColor, ['--accent' as any]: accentColor } as React.CSSProperties)
    : undefined;

  // If href is provided, render an anchor so the link works as expected
  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick} style={style}>
        <span className={styles.label}>{label}</span>
        <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick} style={style}>
      <span className={styles.label}>{label}</span>
      <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
    </button>
  );
}
