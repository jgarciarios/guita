import { useState, useEffect, useRef } from 'react'
import { Surface, Text } from './design'
import { SqliteTransactionRepository } from './data/sqlite/SqliteTransactionRepository'
import type { TransactionRepository } from './data/repositories/TransactionRepository'
import { calculateBalance, formatARS, formatDate } from './domain/finance'
import type { Transaction } from './domain/types'
import { FAB } from './components/FAB'
import { QuickEntryPanel } from './components/QuickEntryPanel'

export default function App() {
  const repoRef = useRef<TransactionRepository | null>(null)
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    SqliteTransactionRepository.create()
      .then(repo => {
        repoRef.current = repo
        return repo.list()
      })
      .then(setTransactions)
      .catch(err => {
        const msg = err instanceof Error ? err.message : JSON.stringify(err)
        setError(msg)
      })
  }, [])

  async function refresh() {
    if (!repoRef.current) return
    const updated = await repoRef.current.list()
    setTransactions(updated)
  }

  function handleSaved() {
    setPanelOpen(false)
    refresh()
  }

  if (error) {
    return (
      <main style={{ padding: 'var(--space-8)' }}>
        <Text variant="muted" style={{ color: 'var(--color-red)' }}>Error al inicializar la base de datos: {error}</Text>
      </main>
    )
  }

  if (transactions === null) {
    return (
      <main style={{ padding: 'var(--space-8)' }}>
        <Text variant="muted">Iniciando base de datos…</Text>
      </main>
    )
  }

  const balance = calculateBalance(transactions)

  return (
    <>
      <main style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 480, paddingBottom: 'var(--space-16)' }}>

        <Text variant="heading" style={{ marginBottom: 'var(--space-2)' }}>Time is Money</Text>

        {/* Balance */}
        <Surface style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <Text variant="muted" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}>SALDO ACTUAL</Text>
          <Text
            variant="amount"
            style={{
              fontSize: 'var(--text-2xl)',
              color: balance >= 0 ? 'var(--color-green)' : 'var(--color-red)',
            }}
          >
            {formatARS(balance)}
          </Text>
        </Surface>

        {/* Movements header */}
        <Text
          variant="muted"
          style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em', marginTop: 'var(--space-2)' }}
        >
          MOVIMIENTOS
        </Text>

        {/* Transaction list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {transactions.map((t) => (
            <Surface
              key={t.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Text variant="body" style={{ fontSize: 'var(--text-sm)' }}>
                  {t.categoryName}
                </Text>
                <Text variant="muted" style={{ fontSize: 'var(--text-xs)' }}>
                  {formatDate(t.date)}
                  {t.note ? ` · ${t.note}` : ''}
                </Text>
              </div>
              <Text
                variant="amount"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: t.type === 'income' ? 'var(--color-green)' : 'var(--color-red)',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.type === 'income' ? '+' : '−'} {formatARS(t.amount)}
              </Text>
            </Surface>
          ))}
        </div>

      </main>

      <FAB onClick={() => setPanelOpen(true)} />

      {panelOpen && repoRef.current && (
        <QuickEntryPanel
          repo={repoRef.current}
          onSaved={handleSaved}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </>
  )
}
