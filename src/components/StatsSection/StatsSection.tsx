import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./StatsSection.module.css";

type StatItem = {
  value: string;
  captionTop?: string;
  captionBottom?: string;
  variant?: "dark" | "light";
};

type Props = {
  items?: StatItem[];
};

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 36" className={className} aria-hidden focusable="false">
      <path d="M16 30 4 10h24L16 30Z" fill="currentColor" opacity="0.22" />
      <path d="M40 30 28 10h24L40 30Z" fill="currentColor" opacity="0.28" />
      <path d="M32 26 22 8h20L32 26Z" fill="currentColor" opacity="0.40" />
    </svg>
  );
}

export function StatsSection({ items }: Props) {
  const data: StatItem[] = useMemo(
    () =>
      items ?? [
        { value: "+15 anos", captionTop: "de experiência no mercado", variant: "dark" },
        {
          value: "+20k",
          captionTop: "Candidatos",
          captionBottom: "cadastrados em nosso banco",
          variant: "light",
        },
        { value: "+45", captionTop: "Instituições parceiras", variant: "light" },
        {
          value: "+360",
          captionTop: "Processos de seleção",
          captionBottom: "atendidos pela Maiêutica",
          variant: "dark",
        },
      ],
    [items]
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const canPrev = index > 0;
  const canNext = index < data.length - 1;

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;

    const clamped = Math.max(0, Math.min(i, data.length - 1));
    setIndex(clamped);

    const firstCard = track.querySelector<HTMLElement>(`.${styles.card}`);
    if (!firstCard) return;

    const gap = parseFloat(getComputedStyle(track).getPropertyValue("--gap") || "18");
    const w = firstCard.getBoundingClientRect().width;
    const x = clamped * (w + gap);
    track.scrollTo({ left: x, behavior: "smooth" });
  };

  useEffect(() => {
    const onResize = () => scrollToIndex(index);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index]);

  const desktopAreas = [styles.areaK1, styles.areaK2, styles.areaK3, styles.areaK4];

  return (
    <section className={styles.section} aria-label="Sobre nós e nossos números">
      <div className={styles.aboutWrap}>
        <div className={styles.aboutBadge}>
          <span className={styles.aboutBadgeIcon} aria-hidden>📚</span>
          <span>NOSSA HISTÓRIA</span>
        </div>

        <h2 className={styles.aboutTitle}>Sobre nós</h2>

        <p className={styles.aboutText}>
          Há mais de 15 anos realizamos um trabalho especializado e personalizado às
          características e demandas da escola, com ética na condução do processo
          seletivo e total respeito aos agentes envolvidos: escola e educadores.
        </p>

        <a href="/about-us" className={styles.aboutCta}>
          Saiba mais sobre nós <span aria-hidden>➜</span>
        </a>
      </div>

      <div className={styles.track} ref={trackRef}>
        {data.map((s, i) => (
          <article
            key={`m-${s.value}-${i}`}
            className={`${styles.card} ${s.variant === "dark" ? styles.dark : styles.light}`}
          >
            <BrandMark className={styles.brandMark} />
            <div className={styles.bottom}>
              <div className={styles.value}>{s.value}</div>
              {(s.captionTop || s.captionBottom) && (
                <div className={styles.captions}>
                  {s.captionTop ? <p>{s.captionTop}</p> : null}
                  {s.captionBottom ? <p>{s.captionBottom}</p> : null}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* MOBILE: botões */}
      <div className={styles.pager} aria-hidden="true">
        <button
          className={`${styles.navBtn} ${styles.prev}`}
          onClick={() => scrollToIndex(index - 1)}
          disabled={!canPrev}
          aria-label="Anterior"
        >
          <span className={styles.chevronPrev}>‹</span>
        </button>
        <button
          className={`${styles.navBtn} ${styles.next}`}
          onClick={() => scrollToIndex(index + 1)}
          disabled={!canNext}
          aria-label="Próximo"
        >
          <span className={styles.chevronNext}>›</span>
        </button>
      </div>

      {/* DESKTOP: grade 4 colunas
          about (2 linhas) | k1 | k2 | imagem (2 linhas)
          about (2 linhas) | k3 | k4 | imagem (2 linhas)
      */}
      <div className={styles.desktopGrid}>
        <div className={`${styles.aboutGrid} ${styles.areaAbout}`}>
          <div className={styles.aboutBadge}>
            <span className={styles.aboutBadgeIcon} aria-hidden>📚</span>
            <span>NOSSA HISTÓRIA</span>
          </div>
          <h2 className={styles.aboutTitle}>Sobre nós</h2>
          <p className={styles.aboutText}>
            Há mais de 15 anos realizamos um trabalho especializado e personalizado às
            características e demandas da escola, com ética na condução do processo
            seletivo e total respeito aos agentes envolvidos: escola e educadores.
          </p>
          <a href="/about-us" className={styles.aboutCta}>
            Saiba mais sobre nós <span aria-hidden>➜</span>
          </a>
        </div>

        {data.map((s, i) => (
          <article
            key={`d-${s.value}-${i}`}
            className={`${styles.card} ${s.variant === "dark" ? styles.dark : styles.light} ${desktopAreas[i]}`}
          >
            <BrandMark className={styles.brandMark} />
            <div className={styles.bottom}>
              <div className={styles.value}>{s.value}</div>
              {(s.captionTop || s.captionBottom) && (
                <div className={styles.captions}>
                  {s.captionTop ? <p>{s.captionTop}</p> : null}
                  {s.captionBottom ? <p>{s.captionBottom}</p> : null}
                </div>
              )}
            </div>
          </article>
        ))}

        <div
          className={`${styles.imageCard} ${styles.areaImg}`}
          role="img"
          aria-label="Imagem ilustrativa (substituir depois)"
        />
      </div>
    </section>
  );
}

export default StatsSection;
