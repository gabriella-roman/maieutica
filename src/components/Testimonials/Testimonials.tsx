import { useState } from "react";
import s from "./Testimonials.module.css";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
};

export default function Testimonials({
  items,
  title = "Depoimentos",
}: {
  items: Testimonial[];
  title?: string;
}) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((v) => (v === 0 ? items.length - 1 : v - 1));
  const next = () => setIdx((v) => (v + 1) % items.length);
  const t = items[idx];

  return (
    <section className={s.root} aria-label={title}>
      <article className={s.card}>
        <div className={s.quoteIcon}>“</div>

        <p className={s.text}>{t.quote}</p>

        <div className={s.author}>
          {t.avatar ? <img className={s.avatar} src={t.avatar} alt="" /> : null}
          <div className={s.meta}>
            <div className={s.name}>{t.name}</div>
            <div className={s.role}>{t.role}</div>
          </div>
        </div>
        
        <div className={s.pagerInside} aria-hidden="true">
          <button className={`${s.navBtn} ${s.prev}`} onClick={prev} aria-label="Anterior">‹</button>
          <button className={`${s.navBtn} ${s.next}`} onClick={next} aria-label="Próximo">›</button>
        </div>
      </article>
    </section>
  );
}
