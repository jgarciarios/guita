import styles from './StatCard.module.css'
import { formatARS } from '../../domain/finance'

interface StatCardProps {
  label: string
  value: number
  variant: 'income' | 'expense' | 'net'
}

export function StatCard({ label, value, variant }: StatCardProps) {
  let color: string
  let prefix: string

  if (variant === 'income') {
    color = 'var(--color-green)'
    prefix = ''
  } else if (variant === 'expense') {
    color = 'var(--color-red)'
    prefix = ''
  } else {
    color = value >= 0 ? 'var(--color-green)' : 'var(--color-red)'
    prefix = value >= 0 ? '+' : '−'
  }

  return (
    <div className={styles.card}>
      <span className={styles.value} style={{ color }}>
        {prefix}{formatARS(Math.abs(value))}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
