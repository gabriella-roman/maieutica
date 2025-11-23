import React, { useEffect, useRef, useState } from "react";
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
  speedSec = 40,
  gap = 56,
}: Props) {
  const styleVars: React.CSSProperties = {
    ["--gap" as any]: `${gap}px`,
  };

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    setLoadedCount(0);
  }, [items]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const vp = viewport as HTMLDivElement;
    const tr = track as HTMLUListElement;
    const totalImages = items.length * 2;
    if (loadedCount < totalImages) return; // wait until all duplicated images load

    let pixelsPerSecond = (tr.scrollWidth / 2) / Math.max(0.1, speedSec);

    function step(time: number) {
      if (pausedRef.current) {
        lastTimeRef.current = time;
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      vp.scrollLeft += pixelsPerSecond * delta;
      const half = tr.scrollWidth / 2;
      if (vp.scrollLeft >= half) {
        vp.scrollLeft -= half;
      }
      rafRef.current = requestAnimationFrame(step);
    }

    vp.scrollLeft = 0;
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [loadedCount, items.length, speedSec]);
  return (
    <section className={styles.section} style={styleVars} aria-label={title}>
      <div className={styles.badge}>
        {badgeIconSrc && (
          <img src={badgeIconSrc} alt="" aria-hidden className={styles.badgeIcon} />
        )}
        <span>{badgeText}</span>
      </div>
      

      <h2 className={styles.title}>{title}</h2>

      <div
        className={styles.viewport}
        ref={viewportRef}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => (pausedRef.current = false)}
      >
        <ul className={styles.track} ref={trackRef} aria-hidden={items.length === 0}>
          {[...items, ...items].map((logo, i) => (
            <li className={styles.item} key={`${logo.alt}-${i}`}>
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                loading="eager"
                onLoad={() => setLoadedCount((s) => s + 1)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
