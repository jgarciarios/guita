export type TransactionType = 'income' | 'expense'
export type PaymentMethod = 'cash' | 'card' | 'transfer'

export interface Category {
  id: string
  name: string
  type: TransactionType
  color: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number  // in centavos (integer)
  currency: string
  categoryId: string
  categoryName: string
  account: string
  date: string // ISO 8601: YYYY-MM-DD
  note?: string
  paymentMethod: PaymentMethod
}
