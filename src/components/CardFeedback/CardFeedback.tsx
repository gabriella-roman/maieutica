import arrow from '../../assets/icons/arrow-orange.svg'
import quotationMarks from '../../assets/icons/quotation-marks.svg'
import styles from './CardFeedback.module.css'

export interface Feedback {
  name: string
  professionalization: string
  image: string
  text: string
  position: number
  onNext: () => void
  onPrevious: () => void
}

export function CardFeedback(props: Feedback) {
  const { name, professionalization, image, text, onNext, onPrevious } = props

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={quotationMarks} alt='Aspas' style={{ marginTop: 32 }} />

        <p className={styles.text}>
          {text}
        </p>

        <div className={styles.authorInfo}>
          <img src={image} alt='Imagem-perfil' className={styles.image} />

          <div className={styles.authorContainer}>
            <span className={styles.author}>{name}</span>
            <span className={styles.professionalization}>{professionalization}</span>
          </div>
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <div className={styles.line} />

        <button className={styles.button} style={{ transform: 'rotate(180deg)' }} onClick={onPrevious}>
          <img src={arrow} alt='Arrow' />
        </button>

        <button className={styles.button} onClick={onNext}>
          <img src={arrow} alt='Arrow' />
        </button>
      </div>
    </div>
  )
}
