import type { ReactNode } from 'react'
import styles from './Chip.module.css'

interface ChipProps {
  selected?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
}

export function Chip({ selected = false, onClick, children, className }: ChipProps) {
  const cls = [
    styles.root,
    selected ? styles.selected : '',
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
