import { useState, useEffect, useRef } from 'react'
import { useUser, useAuth, SignInButton, UserButton } from '@clerk/clerk-react'
import { Surface, Text, Button } from './design'
import { NeonTransactionRepository } from './data/neon/NeonTransactionRepository'
import { InMemoryTransactionRepository } from './data/repositories/InMemoryTransactionRepository'
import { DEMO_TRANSACTIONS, DEMO_ASSETS } from './data/demoData'
import type { TransactionRepository } from './data/repositories/TransactionRepository'
import type { AssetRepository } from './data/repositories/AssetRepository'
import { calculateBalance, formatARS, formatDate } from './domain/finance'
import type { Transaction } from './domain/types'
import { AppShell } from './components/AppShell'
import { QuickEntryPanel } from './components/QuickEntryPanel'
import { Dashboard } from './components/Dashboard'
import { Categories } from './components/Categories'
import { Assets } from './components/Assets'

type View = 'movements' | 'dashboard' | 'categories' | 'assets'
type AppRepository = TransactionRepository & AssetRepository

const NEON_API_URL = import.meta.env.VITE_NEON_DATA_API_URL

export default function App() {
  const { isSignedIn, isLoaded, user } = useUser()
  const { getToken } = useAuth()
  const repoRef = useRef<AppRepository | null>(null)
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [view, setView] = useState<View>('movements')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!isLoaded) return

    setTransactions(null)
    setError(null)
    repoRef.current = null

    if (isSignedIn && user) {
      if (!NEON_API_URL) {
        setError('Falta VITE_NEON_DATA_API_URL en .env.local')
        return
      }
      repoRef.current = new NeonTransactionRepository(NEON_API_URL, user.id, () => getToken({ template: 'neon' }))
    } else {
      repoRef.current = new InMemoryTransactionRepository(DEMO_TRANSACTIONS, DEMO_ASSETS)
    }

    repoRef.current
      .list()
      .then(setTransactions)
      .catch(err => {
        const msg = err instanceof Error ? err.message : JSON.stringify(err)
        setError(msg)
      })
  }, [isLoaded, isSignedIn, user, getToken])

  async function refresh() {
    if (!repoRef.current) return
    const updated = await repoRef.current.list()
    setTransactions(updated)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar este movimiento?')) return
    if (!repoRef.current) return
    await repoRef.current.delete(id)
    refresh()
    setRefreshKey(k => k + 1)
  }

  function closePanel() {
    setPanelOpen(false)
    setEditingTransaction(null)
  }

  function handleSaved() {
    closePanel()
    refresh()
    setRefreshKey(k => k + 1)
  }

  if (error) {
    return (
      <main style={{ padding: 'var(--space-8)' }}>
        <Text variant="muted" style={{ color: 'var(--color-red)' }}>
          Error al inicializar la base de datos: {error}
        </Text>
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
      <AppShell view={view} onViewChange={setView} onFabClick={() => setPanelOpen(true)}>
        <div style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="heading" style={{ marginBottom: 'var(--space-1)' }}>Mango</Text>
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Iniciar sesión</Button>
              </SignInButton>
            )}
          </div>

          {!isSignedIn && (
            <Surface style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Estás viendo datos de ejemplo. Iniciá sesión para guardar los tuyos.
            </Surface>
          )}

          {view === 'movements' && (
            <>
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

              <Text
                variant="muted"
                style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em', marginTop: 'var(--space-2)' }}
              >
                MOVIMIENTOS
              </Text>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {transactions.map((t) => (
                  <Surface
                    key={t.id}
                    onClick={() => setEditingTransaction(t)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', cursor: 'pointer' }}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
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
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(t.id) }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 'var(--space-1)',
                          cursor: 'pointer',
                          color: 'var(--color-text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-red)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                        aria-label="Eliminar movimiento"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 3h12M5 3V2h4v1M2 3l1 9h6l1-9H2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      </button>
                    </div>
                  </Surface>
                ))}
              </div>
            </>
          )}

          {view === 'dashboard' && repoRef.current && (
            <Dashboard
              repo={repoRef.current}
              refreshKey={refreshKey}
            />
          )}

          {view === 'categories' && repoRef.current && (
            <Categories repo={repoRef.current} />
          )}

          {view === 'assets' && repoRef.current && (
            <Assets repo={repoRef.current} />
          )}

        </div>
      </AppShell>

      {(panelOpen || editingTransaction !== null) && repoRef.current && (
        <QuickEntryPanel
          repo={repoRef.current}
          onSaved={handleSaved}
          onClose={closePanel}
          initialData={editingTransaction ?? undefined}
        />
      )}
    </>
  )
}
