import type { Transaction } from '../../domain/types'
import type { TransactionRepository } from './TransactionRepository'

const SEED: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 1_850_000,
    currency: 'ARS',
    categoryId: 'salary',
    account: 'Banco Galicia',
    date: '2026-06-01',
    note: 'Sueldo junio',
    paymentMethod: 'transfer',
  },
  {
    id: '2',
    type: 'expense',
    amount: 420_000,
    currency: 'ARS',
    categoryId: 'rent',
    account: 'Efectivo',
    date: '2026-06-05',
    note: 'Alquiler',
    paymentMethod: 'cash',
  },
  {
    id: '3',
    type: 'expense',
    amount: 87_300,
    currency: 'ARS',
    categoryId: 'groceries',
    account: 'Banco Galicia',
    date: '2026-06-10',
    note: 'Supermercado Coto',
    paymentMethod: 'card',
  },
  {
    id: '4',
    type: 'income',
    amount: 350_000,
    currency: 'ARS',
    categoryId: 'freelance',
    account: 'Banco Galicia',
    date: '2026-06-12',
    note: 'Proyecto freelance',
    paymentMethod: 'transfer',
  },
  {
    id: '5',
    type: 'expense',
    amount: 54_800,
    currency: 'ARS',
    categoryId: 'transport',
    account: 'Efectivo',
    date: '2026-06-15',
    note: 'Nafta',
    paymentMethod: 'cash',
  },
]

export class InMemoryTransactionRepository implements TransactionRepository {
  list(): Transaction[] {
    return [...SEED].sort((a, b) => b.date.localeCompare(a.date))
  }
}
