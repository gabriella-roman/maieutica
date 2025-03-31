import styles from './Section.module.css'

export interface SectionProps {
  icon?: string
  iconColor?: string
  iconAlt?: string
  category: string
  categoryColor?: string
  title: string
  titleColor?: string
  description?: string
  descriptionColor?: string
}

export function Section(props: SectionProps) {
  const { icon, category, title, iconAlt, description = '' } = props

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 4,
      width: 400
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: icon ? 8 : 0 }}>
        {icon && <img src={icon} alt={iconAlt} style={{ height: 24, width: 24 }} />}

        <span className={styles.category} style={{ color: props.categoryColor }}>{category}</span>
      </div>

      <h1 className={styles.title} style={{ color: props.titleColor }}>
        {title}
      </h1>

      <p
        className={styles.description}
        style={{ color: props.descriptionColor }}
        dangerouslySetInnerHTML={{ __html: description }}
      >
      </p>
    </div>
  )
}
