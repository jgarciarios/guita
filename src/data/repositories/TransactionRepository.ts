import type { Transaction } from '../../domain/types'

export interface TransactionRepository {
  list(): Promise<Transaction[]>
}
