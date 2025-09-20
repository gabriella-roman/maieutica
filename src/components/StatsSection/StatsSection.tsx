import React, { useEffect, useMemo, useRef, useState } from "react"
import styles from "./StatsSection.module.css"

type StatItem = {
  value: string
  captionTop?: string
  captionBottom?: string
  variant?: "dark" | "light"
}

type Props = {
  items?: StatItem[]
}

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 36" className={className} aria-hidden focusable="false">
      <path d="M16 30 4 10h24L16 30Z" fill="currentColor" opacity="0.22" />
      <path d="M40 30 28 10h24L40 30Z" fill="currentColor" opacity="0.28" />
      <path d="M32 26 22 8h20L32 26Z" fill="currentColor" opacity="0.40" />
    </svg>
  )
}

// ✅ Hook para animar números
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return // só anima quando "start" for true
    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))

      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [target, duration, start])

  return count
}

// ✅ Função para separar número do texto (ex: "+20k" → {prefix:"+", num:20, suffix:"k"})
function parseValue(str: string) {
  const match = str.match(/([^\d]*)(\d+)([^\d]*)/)
  if (!match) return { prefix: "", num: 0, suffix: str }
  return { prefix: match[1], num: parseInt(match[2]), suffix: match[3] }
}

// ✅ Componente de cada card com IntersectionObserver
function StatCard({ item, className }: { item: StatItem; className?: string }) {
  const { prefix, num, suffix } = parseValue(item.value)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const animated = useCountUp(num, 2000, visible)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          observer.disconnect() // dispara só uma vez
        }
      },
      { threshold: 0.3 } // 30% visível já dispara
    )

    if (ref.current) observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return (
    <article
      ref={ref}
      className={`${styles.card} ${item.variant === "dark" ? styles.dark : styles.light} ${className || ""}`}
    >
      <BrandMark className={styles.brandMark} />
      <div className={styles.bottom}>
        <div className={styles.value}>
          {prefix}
          {visible ? animated : 0}
          {suffix}
        </div>
        {(item.captionTop || item.captionBottom) && (
          <div className={styles.captions}>
            {item.captionTop ? <p>{item.captionTop}</p> : null}
            {item.captionBottom ? <p>{item.captionBottom}</p> : null}
          </div>
        )}
      </div>
    </article>
  )
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
  )

  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const canPrev = index > 0
  const canNext = index < data.length - 1

  const scrollToIndex = (i: number) => {
    const track = trackRef.current
    if (!track) return

    const clamped = Math.max(0, Math.min(i, data.length - 1))
    setIndex(clamped)

    const firstCard = track.querySelector<HTMLElement>(`.${styles.card}`)
    if (!firstCard) return

    const gap = parseFloat(getComputedStyle(track).getPropertyValue("--gap") || "18")
    const w = firstCard.getBoundingClientRect().width
    const x = clamped * (w + gap)
    track.scrollTo({ left: x, behavior: "smooth" })
  }

  useEffect(() => {
    const onResize = () => scrollToIndex(index)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [index])

  const desktopAreas = [styles.areaK1, styles.areaK2, styles.areaK3, styles.areaK4]

  return (
    <section className={styles.section} aria-label="Sobre nós e nossos números">
      {/* MOBILE */}
      <div className={styles.track} ref={trackRef}>
        {data.map((s, i) => (
          <StatCard key={`m-${s.value}-${i}`} item={s} />
        ))}
      </div>

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

      {/* DESKTOP */}
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
          <StatCard
            key={`d-${s.value}-${i}`}
            item={s}
            className={desktopAreas[i]}
          />
        ))}

        <div
          className={`${styles.imageCard} ${styles.areaImg}`}
          role="img"
          aria-label="Imagem ilustrativa (substituir depois)"
        />
      </div>
    </section>
  )
}

export default StatsSection
