import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  variant?: 'default' | 'amount'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, variant = 'default', className, id, ...rest }, ref) {
    const inputCls = [
      styles.input,
      variant === 'amount' ? styles.amount : '',
      className ?? '',
    ].filter(Boolean).join(' ')

    if (label) {
      return (
        <div className={styles.wrapper}>
          <label className={styles.label} htmlFor={id}>{label}</label>
          <input ref={ref} id={id} className={inputCls} {...rest} />
        </div>
      )
    }

    return <input ref={ref} id={id} className={inputCls} {...rest} />
  }
)
