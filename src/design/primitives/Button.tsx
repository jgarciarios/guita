import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  const cls = [
    styles.root,
    styles[variant],
    size !== 'md' ? styles[size] : '',
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}
