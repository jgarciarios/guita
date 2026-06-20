import type { Transaction } from './types'

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount
  }, 0)
}

export function calculateIncomeTotal(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
}

export function calculateExpenseTotal(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
}

export interface CategoryTotal {
  categoryId: string
  categoryName: string
  total: number
}

export function calculateByCategory(transactions: Transaction[]): CategoryTotal[] {
  const map = new Map<string, CategoryTotal>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    const existing = map.get(t.categoryId)
    if (existing) {
      existing.total += t.amount
    } else {
      map.set(t.categoryId, { categoryId: t.categoryId, categoryName: t.categoryName, total: t.amount })
    }
  }
  return [...map.values()].sort((a, b) => b.total - a.total)
}

export function formatARS(cents: number): string {
  return (cents / 100).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  })
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
  })
}
