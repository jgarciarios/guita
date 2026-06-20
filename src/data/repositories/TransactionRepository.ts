import type { Transaction, Category, TransactionType } from '../../domain/types'

export interface TransactionRepository {
  list(): Promise<Transaction[]>
  add(transaction: Omit<Transaction, 'id'>): Promise<Transaction>
  update(transaction: Transaction): Promise<Transaction>
  listCategories(type?: TransactionType): Promise<Category[]>
  createCategory(category: Omit<Category, 'id'>): Promise<Category>
  deleteCategory(id: string): Promise<void>
  listByMonth(year: number, month: number): Promise<Transaction[]>
}
