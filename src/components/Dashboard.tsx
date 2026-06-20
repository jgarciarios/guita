import { useState, useEffect } from 'react'
import type { TransactionRepository } from '../data/repositories/TransactionRepository'
import type { Transaction } from '../domain/types'
import {
  calculateIncomeTotal,
  calculateExpenseTotal,
  calculateByCategory,
} from '../domain/finance'
import { Surface, Text, StatCard, CategoryBar } from '../design'
import styles from './Dashboard.module.css'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

interface DashboardProps {
  repo: TransactionRepository
  refreshKey: number
}

export function Dashboard({ repo, refreshKey }: DashboardProps) {
  const now = new Date()
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [prevTransactions, setPrevTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1

    Promise.all([
      repo.listByMonth(currentYear, currentMonth),
      repo.listByMonth(prevYear, prevMonth),
    ]).then(([curr, prev]) => {
      setTransactions(curr)
      setPrevTransactions(prev)
      setLoading(false)
    })
  }, [currentYear, currentMonth, repo, refreshKey])

  function goToPrevMonth() {
    if (currentMonth === 1) {
      setCurrentYear(y => y - 1)
      setCurrentMonth(12)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  function goToNextMonth() {
    if (currentMonth === 12) {
      setCurrentYear(y => y + 1)
      setCurrentMonth(1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  const isCurrentMonth =
    currentYear === now.getFullYear() && currentMonth === now.getMonth() + 1

  const income = calculateIncomeTotal(transactions)
  const expenses = calculateExpenseTotal(transactions)
  const net = income - expenses
  const byCategory = calculateByCategory(transactions)
  const prevExpenses = calculateExpenseTotal(prevTransactions)

  const hasPrevData = prevTransactions.length > 0
  const expenseDelta = expenses - prevExpenses
  const expenseDeltaPct =
    prevExpenses > 0 ? Math.round(Math.abs(expenseDelta / prevExpenses) * 100) : null
  const prevMonthName =
    MONTH_NAMES[currentMonth === 1 ? 11 : currentMonth - 2]

  return (
    <div className={styles.container}>
      <div className={styles.monthNav}>
        <button className={styles.navBtn} onClick={goToPrevMonth} aria-label="Mes anterior">
          ←
        </button>
        <span className={styles.monthLabel}>
          {MONTH_NAMES[currentMonth - 1].toUpperCase()} {currentYear}
        </span>
        <button
          className={styles.navBtn}
          onClick={goToNextMonth}
          disabled={isCurrentMonth}
          aria-label="Mes siguiente"
        >
          →
        </button>
      </div>

      {loading ? (
        <Text variant="muted">Cargando…</Text>
      ) : (
        <>
          <div className={styles.stats}>
            <StatCard label="INGRESOS" value={income} variant="income" />
            <StatCard label="GASTOS" value={expenses} variant="expense" />
            <StatCard label="NETO" value={net} variant="net" className={styles.statFull} />
          </div>

          {byCategory.length > 0 && (
            <Surface>
              <p className={styles.sectionLabel}>GASTOS POR CATEGORÍA</p>
              <div className={styles.categories}>
                {byCategory.map(cat => (
                  <CategoryBar
                    key={cat.categoryId}
                    name={cat.categoryName}
                    amount={cat.total}
                    percentage={expenses > 0 ? Math.round((cat.total / expenses) * 100) : 0}
                  />
                ))}
              </div>
            </Surface>
          )}

          {hasPrevData && expenseDeltaPct !== null && (
            <Surface>
              <p className={styles.sectionLabel}>VS MES ANTERIOR</p>
              <div className={styles.comparison}>
                <span
                  className={styles.delta}
                  style={{ color: expenseDelta <= 0 ? 'var(--color-green)' : 'var(--color-red)' }}
                >
                  {expenseDelta <= 0 ? '↓' : '↑'} {expenseDeltaPct}%
                </span>
                <span className={styles.comparisonText}>
                  {expenseDelta <= 0 ? 'menos' : 'más'} gastos que en {prevMonthName}
                </span>
              </div>
            </Surface>
          )}

          {transactions.length === 0 && (
            <p className={styles.empty}>Sin movimientos este mes</p>
          )}
        </>
      )}
    </div>
  )
}
