import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./WhatWeDoSection.module.css";
import { ServiceCard } from "../ServiceCard/ServiceCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import arrowRight from '../../assets/icons/arrow-right.svg';
import arrowLeft from '../../assets/icons/arrow-left.svg';

export type ServiceItem = {
  title: string;
  description: string;
  href?: string;
  icon?: React.ReactNode;
  colors?: {
    accent?: string;
    iconBg?: string;
    iconFg?: string;
    text?: string;
  };
};

type Props = { items: ServiceItem[] };

export function WhatWeDoSection({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  const getStep = useCallback((): number => {
    const el = trackRef.current;
    if (!el) return 0;
    const first = el.firstElementChild as HTMLElement | null;
    const slideW = first ? first.getBoundingClientRect().width : el.clientWidth;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0");
    return slideW + gap;
  }, []);

  const updateIndexFromScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const step = getStep();
    if (step <= 0) return;
    const raw = el.scrollLeft / step;
    const nextIdx = clamp(Math.round(raw), 0, Math.max(items.length - 1, 0));
    setIndex(nextIdx);
  }, [getStep, items.length]);

  useEffect(() => {
    updateIndexFromScroll();
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => updateIndexFromScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateIndexFromScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateIndexFromScroll);
    };
  }, [items.length, updateIndexFromScroll]);

  const scrollToIndex = (target: number) => {
    const el = trackRef.current;
    if (!el) return;
    const step = getStep();
    const clamped = clamp(target, 0, Math.max(items.length - 1, 0));
    el.scrollTo({ left: step * clamped, behavior: "smooth" });
    setIndex(clamped);
  };

  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  return (
    <section className={styles.section} aria-labelledby="whatwedo-title">
      <div className={styles.container}>
        <div className={styles.mobileBlock}>
          <div className={styles.intro}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon} aria-hidden><FontAwesomeIcon icon={faUsers} /></span>
              <span>NOSSAS SOLUCOES</span>
            </div>

            <h2 id="whatwedo-title" className={styles.title}>
              O que fazemos?
            </h2>

            <p className={styles.text}>
              Oferecemos solucoes personalizadas em recursos humanos para o ecossistema escolar.
            </p>
            <p className={styles.text}>
              Do processo seletivo especializado ao aconselhamento de carreira, impulsionamos o crescimento de instituicoes de ensino e profissionais da educacao.
            </p>
          </div>

          <div ref={trackRef} className={styles.track} aria-label="Serviços">
            {items.map((it, i) => (
              <div className={styles.slide} key={`m-${i}`}>
                <ServiceCard
                  title={it.title}
                  description={it.description}
                  href={it.href}
                  icon={it.icon}
                  colors={it.colors}
                />
              </div>
            ))}
          </div>

          <div className={styles.pager} aria-hidden="true">
            <button
              className={`${styles.navBtn} ${styles.prev}`}
              onClick={() => scrollToIndex(index - 1)}
              disabled={!canPrev}
              aria-label="Anterior"
            >
              <img src={arrowLeft} alt="Seta para a esquerda" />
            </button>
            <button
              className={`${styles.navBtn} ${styles.next}`}
              onClick={() => scrollToIndex(index + 1)}
              disabled={!canNext}
              aria-label="Próximo"
            >
              <img src={arrowRight} alt="Seta para a direita" />
            </button>
          </div>
        </div>

        <div className={styles.desktopGrid}>
          <div className={styles.introDesk}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon} aria-hidden><FontAwesomeIcon icon={faUsers} /></span>
              <span>NOSSAS SOLUCOES</span>
            </div>

            <h2 className={styles.title}>O que fazemos?</h2>

            <p className={styles.text}>
              Oferecemos solucoes personalizadas em recursos humanos para o ecossistema escolar.
            </p>
            <p className={styles.text}>
              Do processo seletivo especializado ao aconselhamento de carreira, impulsionamos o crescimento de instituicoes de ensino e profissionais da educacao.
            </p>
          </div>

          {items[0] && (
            <div className={styles.slot0}>
              <ServiceCard {...items[0]} />
            </div>
          )}
          {items[1] && (
            <div className={styles.slot1}>
              <ServiceCard {...items[1]} />
            </div>
          )}
          {items[2] && (
            <div className={styles.slot2}>
              <ServiceCard {...items[2]} />
            </div>
          )}
          {items[3] && (
            <div className={styles.slot3}>
              <ServiceCard {...items[3]} />
            </div>
          )}
          {items[4] && (
            <div className={styles.slot4}>
              <ServiceCard {...items[4]} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
