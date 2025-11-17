import React, { useEffect, useId, useRef, useState } from "react";
import styles from "./FiltersBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faFilter, faXmark } from "@fortawesome/free-solid-svg-icons";

export type FilterKey =
  | "area"
  | "disciplina"
  | "bilingue"
  | "localizacao";

export type FiltersState = Partial<Record<FilterKey, string>>;

export type FilterConfig = {
  key: FilterKey;
  label: string;
  options: { value: string; label: string }[];
};

export function FiltersBar({
  configs,
  value,
  onChange,
  className,
}: {
  configs: FilterConfig[];
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  /** optional class applied to the wrapper element (useful for layout overrides) */
  className?: string;
}) {
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);

  useEffect(() => {
    const original = document.body.style.overflow;
    if (openKey) document.body.style.overflow = "hidden";
    else document.body.style.overflow = original || "";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [openKey]);

  const close = () => setOpenKey(null);

  return (
    <>
  <div className={`${styles.wrapper} ${className ?? ""}`} role="toolbar" aria-label="Filtros">
        {configs.map((cfg) => {
          const current = value[cfg.key];
          const currentLabel =
            current && cfg.options.find((o) => o.value === current)?.label;
          return (
            <button
              key={cfg.key}
              className={styles.chip}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={openKey === cfg.key}
              onClick={() => setOpenKey(cfg.key)}
            >
              <span className={styles.chipLabel}>
                {currentLabel || cfg.label}
              </span>
              <span className={styles.icons}>
                <FontAwesomeIcon icon={faFilter} />
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </button>
          );
        })}
      </div>

      {configs.map((cfg) =>
        openKey === cfg.key ? (
          <OptionsModal
            key={cfg.key}
            title={cfg.label}
            options={cfg.options}
            selected={value[cfg.key] ?? ""}
            onSelect={(val) => {
              const next = { ...value, [cfg.key]: val };
              onChange(next);
              close();
            }}
            onClear={() => {
              const next = { ...value };
              delete next[cfg.key];
              onChange(next);
              close();
            }}
            onClose={close}
          />
        ) : null
      )}
    </>
  );
}

function OptionsModal({
  title,
  options,
  selected,
  onSelect,
  onClear,
  onClose,
}: {
  title: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const dialogId = useId();
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogId}
      onClick={onClose}
    >
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <header className={styles.sheetHeader}>
          <h2 id={dialogId} className={styles.sheetTitle}>
            {title}
          </h2>
          <button
            className={styles.iconBtn}
            aria-label="Fechar"
            onClick={onClose}
            ref={firstBtnRef}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>

        <div className={styles.options}>
          {options.map((opt) => {
            const isActive = selected === opt.value;
            return (
              <button
                key={opt.value}
                className={isActive ? `${styles.opt} ${styles.optActive}` : styles.opt}
                onClick={() => onSelect(opt.value)}
                type="button"
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <footer className={styles.footer}>
          <button className={styles.clearBtn} onClick={onClear} type="button">
            Limpar filtro
          </button>
          <button className={styles.applyBtn} onClick={onClose} type="button">
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}
