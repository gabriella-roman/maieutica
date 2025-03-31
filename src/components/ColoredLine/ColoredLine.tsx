import styles from './ColoredLine.module.css'

export function ColoredLine () {
  return (
    <div className={styles.coloredLine}>
      <div className={styles.color} style={{ backgroundColor: 'rgba(90, 158, 140, 1)'}}/>

      <div className={styles.color} style={{ backgroundColor: 'rgba(206, 108, 57, 1)'}}/>

      <div className={styles.color} style={{ backgroundColor: 'rgba(8, 67, 133, 1)'}}/>

      <div className={styles.color} style={{ backgroundColor: 'rgba(223, 162, 66, 1)'}}/>

      <div className={styles.color} style={{ backgroundColor: 'rgba(194, 84, 80, 1)'}}/>
    </div>
  )
}
