import { useState, useEffect, useRef } from 'react'
import { Surface, Text, Input, Button } from '../design'
import type { TransactionRepository } from '../data/repositories/TransactionRepository'
import type { Category } from '../domain/types'
import styles from './Categories.module.css'

interface Props {
  repo: TransactionRepository
}

export function Categories({ repo }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleteError, setDeleteError] = useState<{ id: string; msg: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function load() {
    const cats = await repo.listCategories('expense')
    setCategories(cats)
  }

  useEffect(() => { load() }, [repo])

  async function handleAdd() {
    const name = newName.trim()
    if (!name) {
      inputRef.current?.focus()
      return
    }
    setAdding(true)
    try {
      await repo.createCategory({ name, type: 'expense', color: '#E5544B' })
      setNewName('')
      await load()
      inputRef.current?.focus()
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(cat: Category) {
    setDeleteError(null)
    try {
      await repo.deleteCategory(cat.id)
      await load()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo eliminar.'
      setDeleteError({ id: cat.id, msg })
    }
  }

  return (
    <div className={styles.container}>
      <Text variant="muted" className={styles.sectionLabel}>CATEGORÍAS DE GASTOS</Text>

      <div className={styles.list}>
        {categories.length === 0 && (
          <Text variant="muted" className={styles.empty}>Sin categorías. Agregá una abajo.</Text>
        )}
        {categories.map(cat => (
          <div key={cat.id}>
            <Surface className={styles.row}>
              <Text variant="body" className={styles.catName}>{cat.name}</Text>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(cat)}
                aria-label={`Eliminar ${cat.name}`}
              >
                <IconTrash />
              </button>
            </Surface>
            {deleteError?.id === cat.id && (
              <p className={styles.deleteError}>{deleteError.msg}</p>
            )}
          </div>
        ))}
      </div>

      <Surface className={styles.addForm}>
        <Text variant="muted" className={styles.sectionLabel}>NUEVA CATEGORÍA</Text>
        <div className={styles.addRow}>
          <Input
            ref={inputRef}
            id="cat-name"
            type="text"
            placeholder="Nombre (con emoji si querés)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            className={styles.nameInput}
          />
          <Button size="sm" disabled={adding} onClick={handleAdd}>
            {adding ? '…' : 'AGREGAR'}
          </Button>
        </div>
      </Surface>
    </div>
  )
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
