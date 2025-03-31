import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NavbarFooter.module.css'

export interface NavbarFooterOption {
  title: string
  navigate: string
}

export interface NavbarFooterProps {
  title: string
  options: NavbarFooterOption[]
}

export function NavbarFooter({ title, options }: NavbarFooterProps) {
  const navigate = useNavigate()

  return (
    <div>
      <h1 className={styles.title}>{title}</h1>
      {options.map((option, index) => (
        <div
          key={index}
          style={{ cursor: 'pointer', marginBottom: 8 }}
          onClick={() => navigate(option.navigate)}
        >
          <p className={styles.option}>
            {option.title}
          </p>
        </div>
      ))}
    </div>
  )
}
