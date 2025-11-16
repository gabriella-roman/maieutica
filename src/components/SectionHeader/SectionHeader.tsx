import styles from './SectionHeader.module.css'

export interface SectionHeaderProps {
  title: string
  subtitle: string
  backgroundColor: string
}

export default function SectionHeader(props: SectionHeaderProps) {
  const { title, subtitle, backgroundColor } = props

  return (
    <div className={styles.sectionHeader} style={{ backgroundColor: backgroundColor }}>
        <h1>
          {title}
        </h1>
        <span>
          {subtitle}
        </span>
      </div>
  )
}
