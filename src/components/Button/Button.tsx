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

  return (
    <button 
      type="button" 
      className={styles.button} 
      onClick={onClick}
      style={accentColor ? {
        borderColor: accentColor,
        color: accentColor,
        ['--accent' as any]: accentColor
      } : undefined}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.divider} aria-hidden />
      <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
    </button>
  );
}
