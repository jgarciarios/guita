import { useState, useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { Button, Input, Chip } from '../design'
import type { TransactionRepository } from '../data/repositories/TransactionRepository'
import type { Category, Transaction, TransactionType } from '../domain/types'
import styles from './QuickEntryPanel.module.css'

interface Props {
  repo: TransactionRepository
  onSaved: () => void
  onClose: () => void
  initialData?: Transaction
}

export function QuickEntryPanel({ repo, onSaved, onClose, initialData }: Props) {
  const isEdit = initialData !== undefined

  const [type, setType] = useState<TransactionType>(initialData?.type ?? 'expense')
  const [amount, setAmount] = useState(initialData ? String(initialData.amount / 100) : '')
  const [categoryId, setCategoryId] = useState<string | null>(initialData?.categoryId ?? null)
  const [date, setDate] = useState(initialData?.date ?? todayISO())
  const [note, setNote] = useState(initialData?.note ?? '')
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const amountRef = useRef<HTMLInputElement>(null)
  const skipCategoryReset = useRef(isEdit)

  useEffect(() => {
    amountRef.current?.focus()
  }, [])

  useEffect(() => {
    repo.listCategories(type).then(cats => {
      setCategories(cats)
      if (skipCategoryReset.current) {
        skipCategoryReset.current = false
        return
      }
      setCategoryId(null)
    })
  }, [type, repo])

  async function handleSave() {
    const amountInt = parseInt(amount, 10)
    if (!amount || isNaN(amountInt) || amountInt <= 0) {
      setError('Ingresá un monto válido')
      amountRef.current?.focus()
      return
    }
    if (!categoryId) {
      setError('Elegí una categoría')
      return
    }

    setError(null)
    setSaving(true)
    try {
      if (isEdit) {
        await repo.update({
          ...initialData,
          type,
          amount: amountInt * 100,
          currency: 'ARS',
          categoryId,
          categoryName: categories.find(c => c.id === categoryId)?.name ?? categoryId,
          date,
          note: note.trim() || undefined,
        })
      } else {
        await repo.add({
          type,
          amount: amountInt * 100,
          currency: 'ARS',
          categoryId,
          categoryName: categories.find(c => c.id === categoryId)?.name ?? categoryId,
          account: 'Efectivo',
          date,
          note: note.trim() || undefined,
          paymentMethod: 'cash',
        })
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onKeyDown={handleKeyDown} onClick={handleOverlayClick}>
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label={isEdit ? 'Editar movimiento' : 'Agregar movimiento'}>

        {/* Header: tipo + cerrar */}
        <div className={styles.header}>
          <div className={styles.typeToggle}>
            <button
              type="button"
              className={[styles.typeBtn, styles.typeBtnExpense, type === 'expense' ? styles.typeBtnActive : ''].filter(Boolean).join(' ')}
              onClick={() => setType('expense')}
            >
              Gasto
            </button>
            <button
              type="button"
              className={[styles.typeBtn, styles.typeBtnIncome, type === 'income' ? styles.typeBtnActive : ''].filter(Boolean).join(' ')}
              onClick={() => setType('income')}
            >
              Ingreso
            </button>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Monto */}
        <div className={styles.amountRow}>
          <span className={styles.currency}>$</span>
          <Input
            ref={amountRef}
            variant="amount"
            className={styles.amountInput}
            type="number"
            inputMode="numeric"
            step="1"
            min="1"
            placeholder="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            aria-label="Monto en pesos"
          />
        </div>

        {/* Categorías */}
        <div className={styles.chips}>
          {categories.map(cat => (
            <Chip
              key={cat.id}
              selected={categoryId === cat.id}
              onClick={() => setCategoryId(cat.id)}
            >
              {cat.name}
            </Chip>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* Fecha + nota */}
        <div className={styles.metaRow}>
          <Input
            label="Fecha"
            id="qe-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <Input
            label="Nota"
            id="qe-note"
            type="text"
            placeholder="opcional"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <Button size="lg" disabled={saving} onClick={handleSave}>
          {saving ? 'Guardando…' : isEdit ? 'GUARDAR CAMBIOS' : 'GUARDAR'}
        </Button>

      </div>
    </div>
  )
}

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
