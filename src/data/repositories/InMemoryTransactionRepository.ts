import type { Transaction, Category, TransactionType } from '../../domain/types'
import type { TransactionRepository } from './TransactionRepository'

const SEED_CATEGORIES: Category[] = [
  { id: 'salary',    name: 'Sueldo',       type: 'income',  color: '#2FBF71' },
  { id: 'freelance', name: 'Freelance',    type: 'income',  color: '#2FBF71' },
  { id: 'rent',      name: 'Alquiler',     type: 'expense', color: '#E5544B' },
  { id: 'groceries', name: 'Supermercado', type: 'expense', color: '#E5544B' },
  { id: 'transport', name: 'Transporte',   type: 'expense', color: '#E5544B' },
]

export class InMemoryTransactionRepository implements TransactionRepository {
  private categories: Category[] = [...SEED_CATEGORIES]
  private data: Transaction[]

  constructor(seed: Transaction[] = []) {
    this.data = [...seed]
  }

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

  delete(id: string): Promise<void> {
    this.data = this.data.filter(t => t.id !== id)
    return Promise.resolve()
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
