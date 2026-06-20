import styles from './CategoryBar.module.css'
import { formatARS } from '../../domain/finance'

interface CategoryBarProps {
  name: string
  amount: number
  percentage: number
}

export function CategoryBar({ name, amount, percentage }: CategoryBarProps) {
  return (
    <div className={styles.row}>
      <span className={styles.name}>{name}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${percentage}%` }} />
      </div>
      <span className={styles.amount}>{formatARS(amount)}</span>
    </div>
  )
}
