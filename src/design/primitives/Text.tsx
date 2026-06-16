import { createElement } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import styles from './Text.module.css'

type TextVariant = 'body' | 'muted' | 'heading' | 'amount'
type TextTag = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'label'

const defaultTag: Record<TextVariant, TextTag> = {
  body:    'p',
  muted:   'p',
  heading: 'h2',
  amount:  'span',
}

interface TextProps {
  variant?: TextVariant
  as?: TextTag
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Text({ variant = 'body', as, children, className, style }: TextProps) {
  const tag = as ?? defaultTag[variant]

  const cls = [
    styles.root,
    variant !== 'body' ? styles[variant] : '',
    className ?? '',
  ].filter(Boolean).join(' ')

  return createElement(tag, { className: cls, style }, children)
}
