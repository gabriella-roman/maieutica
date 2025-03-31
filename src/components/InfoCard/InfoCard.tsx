import styles from './InfoCard.module.css'
import arrow from '../../assets/icons/arrow.svg'

export interface InfoCardProps {
  color: string
  icon: string
  text: string
  description: string
  link: string
}

export function InfoCard(props: InfoCardProps) {
  const { color, icon, text, description, link } = props

  return (
    <div className={styles.container} style={{ backgroundColor: color }}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <img src={icon} alt='Ícone' />
        </div>

        <span className={styles.text}>
          {text}
        </span>

        <span className={styles.description}>
          {description}
        </span>
      </div>

      <div className={styles.linkContainer}>
        <a href={link} className={styles.link}>
          Saiba mais
        </a>

        <img src={arrow} alt='Arrow' />
      </div>
    </div >
  )
}
