import { useState, useEffect, useRef } from 'react'
import { Surface, Text, Input, Button, Chip } from '../design'
import type { AssetRepository } from '../data/repositories/AssetRepository'
import { ASSET_CATEGORIES } from '../data/repositories/AssetRepository'
import type { Asset, AssetCategory } from '../domain/types'
import { formatARS } from '../domain/finance'
import styles from './Assets.module.css'

interface Props {
  repo: AssetRepository
}

export function Assets({ repo }: Props) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [category, setCategory] = useState<AssetCategory>('cuenta')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  async function load() {
    const list = await repo.listAssets()
    setAssets(list)
  }

  useEffect(() => { load() }, [repo])

  const total = assets.reduce((acc, a) => acc + a.value, 0)

  async function handleAdd() {
    const trimmed = name.trim()
    const valueInt = parseInt(value, 10)
    if (!trimmed) {
      setError('Ingresá un nombre')
      nameRef.current?.focus()
      return
    }
    if (!value || isNaN(valueInt) || valueInt <= 0) {
      setError('Ingresá un valor válido')
      return
    }
    setError(null)
    setAdding(true)
    try {
      await repo.addAsset({ name: trimmed, category, value: valueInt * 100, currency: 'ARS' })
      setName('')
      setValue('')
      await load()
      nameRef.current?.focus()
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(asset: Asset) {
    if (!window.confirm(`¿Eliminar "${asset.name}"?`)) return
    await repo.deleteAsset(asset.id)
    await load()
  }

  return (
    <div className={styles.container}>
      <Surface className={styles.totalCard}>
        <Text variant="muted" className={styles.sectionLabel}>TOTAL EN ACTIVOS</Text>
        <Text variant="amount" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-green)' }}>
          {formatARS(total)}
        </Text>
      </Surface>

      <Text variant="muted" className={styles.sectionLabel}>TUS ACTIVOS</Text>

      <div className={styles.list}>
        {assets.length === 0 && (
          <Text variant="muted" className={styles.empty}>Sin activos todavía. Agregá uno abajo.</Text>
        )}
        {assets.map(a => (
          <Surface key={a.id} className={styles.row}>
            <div className={styles.info}>
              <Text variant="body" className={styles.assetName}>{a.name}</Text>
              <Text variant="muted" className={styles.assetCategory}>
                {ASSET_CATEGORIES.find(c => c.value === a.category)?.label ?? a.category}
              </Text>
            </div>
            <div className={styles.rowRight}>
              <Text variant="amount" className={styles.assetValue}>{formatARS(a.value)}</Text>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(a)}
                aria-label={`Eliminar ${a.name}`}
              >
                <IconTrash />
              </button>
            </div>
          </Surface>
        ))}
      </div>

      <Surface className={styles.addForm}>
        <Text variant="muted" className={styles.sectionLabel}>NUEVO ACTIVO</Text>

        <div className={styles.chips}>
          {ASSET_CATEGORIES.map(c => (
            <Chip key={c.value} selected={category === c.value} onClick={() => setCategory(c.value)}>
              {c.label}
            </Chip>
          ))}
        </div>

        <Input
          ref={nameRef}
          id="asset-name"
          type="text"
          placeholder="Nombre (ej: Cuenta Galicia)"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className={styles.addRow}>
          <Input
            id="asset-value"
            type="number"
            inputMode="numeric"
            placeholder="Valor actual"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            className={styles.valueInput}
          />
          <Button size="sm" disabled={adding} onClick={handleAdd}>
            {adding ? '…' : 'AGREGAR'}
          </Button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
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
