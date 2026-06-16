import type { Transaction } from '../../domain/types'

export interface TransactionRepository {
  list(): Transaction[]
}
