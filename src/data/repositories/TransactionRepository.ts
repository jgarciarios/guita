import type { Transaction, Category, TransactionType } from '../../domain/types'

export interface TransactionRepository {
  list(): Promise<Transaction[]>
  add(transaction: Omit<Transaction, 'id'>): Promise<Transaction>
  listCategories(type?: TransactionType): Promise<Category[]>
  listByMonth(year: number, month: number): Promise<Transaction[]>
}
