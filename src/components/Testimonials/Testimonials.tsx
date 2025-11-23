import { useState } from "react";
import s from "./Testimonials.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import arrowRight from '../../assets/icons/arrow-right.svg';
import arrowLeft from '../../assets/icons/arrow-left.svg';

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

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '24px',
        }}>
          <div className={s.author}>
            {t.avatar ? <img className={s.avatar} src={t.avatar} alt="" /> : null}
            <div className={s.meta}>
              <div className={s.name}>{t.name}</div>
              <div className={s.role}>{t.role}</div>
            </div>
          </div>

          <div className={s.pagerInside} aria-hidden="true">
            <button className={`${s.navBtn} ${s.prev}`} onClick={prev} aria-label="Anterior">
              <img src={arrowLeft} alt="Seta para a esquerda" />
            </button>
            <button className={`${s.navBtn} ${s.next}`} onClick={next} aria-label="Próximo">
              <img src={arrowRight} alt="Seta para a direita" />
            </button>
          </div>
        </div>

      </article>
    </section>
  );
}
