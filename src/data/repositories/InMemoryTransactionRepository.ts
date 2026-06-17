import type { Transaction } from '../../domain/types'
import type { TransactionRepository } from './TransactionRepository'

const CATEGORY_NAME: Record<string, string> = {
  salary:    'Sueldo',
  freelance: 'Freelance',
  rent:      'Alquiler',
  groceries: 'Supermercado',
  transport: 'Transporte',
}

const SEED: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 185_000_000,
    currency: 'ARS',
    categoryId: 'salary',
    categoryName: 'Sueldo',
    account: 'Banco Galicia',
    date: '2026-06-01',
    note: 'Sueldo junio',
    paymentMethod: 'transfer',
  },
  {
    id: '2',
    type: 'expense',
    amount: 42_000_000,
    currency: 'ARS',
    categoryId: 'rent',
    categoryName: 'Alquiler',
    account: 'Efectivo',
    date: '2026-06-05',
    note: 'Alquiler',
    paymentMethod: 'cash',
  },
  {
    id: '3',
    type: 'expense',
    amount: 8_730_000,
    currency: 'ARS',
    categoryId: 'groceries',
    categoryName: 'Supermercado',
    account: 'Banco Galicia',
    date: '2026-06-10',
    note: 'Supermercado Coto',
    paymentMethod: 'card',
  },
  {
    id: '4',
    type: 'income',
    amount: 35_000_000,
    currency: 'ARS',
    categoryId: 'freelance',
    categoryName: 'Freelance',
    account: 'Banco Galicia',
    date: '2026-06-12',
    note: 'Proyecto freelance',
    paymentMethod: 'transfer',
  },
  {
    id: '5',
    type: 'expense',
    amount: 5_480_000,
    currency: 'ARS',
    categoryId: 'transport',
    categoryName: 'Transporte',
    account: 'Efectivo',
    date: '2026-06-15',
    note: 'Nafta',
    paymentMethod: 'cash',
  },
]

export class InMemoryTransactionRepository implements TransactionRepository {
  list(): Promise<Transaction[]> {
    const sorted = [...SEED]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(t => ({ ...t, categoryName: CATEGORY_NAME[t.categoryId] ?? t.categoryId }))
    return Promise.resolve(sorted)
  }
}
