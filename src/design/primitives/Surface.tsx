import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import styles from './Surface.module.css'

interface SurfaceProps {
  variant?: 'default' | 'elevated'
  padding?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: HTMLAttributes<HTMLDivElement>['onClick']
}

export function Surface({ variant = 'default', padding = true, children, className, style, onClick }: SurfaceProps) {
  const cls = [
    styles.root,
    variant === 'elevated' ? styles.elevated : '',
    padding ? styles.padded : '',
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} style={style} onClick={onClick}>
      {children}
    </div>
  )
}
