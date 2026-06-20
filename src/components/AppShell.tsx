import type { ReactNode } from 'react'
import styles from './AppShell.module.css'
import { FAB } from './FAB'

type View = 'movements' | 'dashboard' | 'categories'

interface AppShellProps {
  view: View
  onViewChange: (v: View) => void
  onFabClick: () => void
  children: ReactNode
}

function IconMovements() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2" y="4"  width="16" height="2" fill="currentColor" />
      <rect x="2" y="9"  width="16" height="2" fill="currentColor" />
      <rect x="2" y="14" width="10" height="2" fill="currentColor" />
    </svg>
  )
}

function IconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2"  y="10" width="4" height="8" fill="currentColor" />
      <rect x="8"  y="6"  width="4" height="12" fill="currentColor" />
      <rect x="14" y="2"  width="4" height="16" fill="currentColor" />
    </svg>
  )
}

function IconCategories() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M3 4h7l6 6-6 6H3V4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="7" cy="10" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function AppShell({ view, onViewChange, onFabClick, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        {children}
      </div>

      <div className={styles.fab}>
        <FAB onClick={onFabClick} />
      </div>

      <nav className={styles.bottomNav}>
        <button
          className={`${styles.navItem} ${view === 'movements' ? styles.navItemActive : ''}`}
          onClick={() => onViewChange('movements')}
          aria-label="Movimientos"
          aria-current={view === 'movements' ? 'page' : undefined}
        >
          <IconMovements />
          Movimientos
        </button>
        <button
          className={`${styles.navItem} ${view === 'dashboard' ? styles.navItemActive : ''}`}
          onClick={() => onViewChange('dashboard')}
          aria-label="Dashboard"
          aria-current={view === 'dashboard' ? 'page' : undefined}
        >
          <IconDashboard />
          Dashboard
        </button>
        <button
          className={`${styles.navItem} ${view === 'categories' ? styles.navItemActive : ''}`}
          onClick={() => onViewChange('categories')}
          aria-label="Categorías"
          aria-current={view === 'categories' ? 'page' : undefined}
        >
          <IconCategories />
          Categorías
        </button>
      </nav>
    </div>
  )
}
