import type { Transaction, Category, TransactionType } from '../../domain/types'
import type { TransactionRepository } from './TransactionRepository'

const SEED_CATEGORIES: Category[] = [
  { id: 'salary',    name: 'Sueldo',       type: 'income',  color: '#2FBF71' },
  { id: 'freelance', name: 'Freelance',    type: 'income',  color: '#2FBF71' },
  { id: 'rent',      name: 'Alquiler',     type: 'expense', color: '#E5544B' },
  { id: 'groceries', name: 'Supermercado', type: 'expense', color: '#E5544B' },
  { id: 'transport', name: 'Transporte',   type: 'expense', color: '#E5544B' },
]

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
  private categories: Category[] = [...SEED_CATEGORIES]
  private data: Transaction[] = SEED.map(t => {
    const cat = SEED_CATEGORIES.find(c => c.id === t.categoryId)
    return { ...t, categoryName: cat?.name ?? t.categoryId }
  })

  private categoryName(id: string): string {
    return this.categories.find(c => c.id === id)?.name ?? id
  }

  list(): Promise<Transaction[]> {
    const sorted = [...this.data].sort((a, b) => b.date.localeCompare(a.date))
    return Promise.resolve(sorted)
  }

  add(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const created: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      categoryName: this.categoryName(transaction.categoryId),
    }
    this.data.push(created)
    return Promise.resolve(created)
  }

  update(transaction: Transaction): Promise<Transaction> {
    const idx = this.data.findIndex(t => t.id === transaction.id)
    if (idx === -1) return Promise.reject(new Error(`Transaction ${transaction.id} not found`))
    const updated: Transaction = {
      ...transaction,
      categoryName: this.categoryName(transaction.categoryId),
    }
    this.data[idx] = updated
    return Promise.resolve(updated)
  }

  listCategories(type?: TransactionType): Promise<Category[]> {
    const result = type ? this.categories.filter(c => c.type === type) : [...this.categories]
    return Promise.resolve(result)
  }

  createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const created: Category = { ...category, id: crypto.randomUUID() }
    this.categories.push(created)
    return Promise.resolve(created)
  }

  deleteCategory(id: string): Promise<void> {
    const inUse = this.data.some(t => t.categoryId === id)
    if (inUse) return Promise.reject(new Error('La categoría tiene movimientos asociados y no puede eliminarse.'))
    this.categories = this.categories.filter(c => c.id !== id)
    return Promise.resolve()
  }

  listByMonth(year: number, month: number): Promise<Transaction[]> {
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    const filtered = this.data
      .filter(t => t.date.startsWith(prefix))
      .sort((a, b) => b.date.localeCompare(a.date))
    return Promise.resolve(filtered)
  }
}
