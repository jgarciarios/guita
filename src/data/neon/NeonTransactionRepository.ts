import type { Transaction, Category, TransactionType } from '../../domain/types'
import type { TransactionRepository } from '../repositories/TransactionRepository'

type GetToken = () => Promise<string | null>

interface TransactionRow {
  id: string
  type: 'income' | 'expense'
  amount: number
  currency: string
  category_id: string
  account: string
  date: string
  note: string | null
  payment_method: 'cash' | 'card' | 'transfer'
}

interface CategoryRow {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
}

// Repositorio que habla con Neon via su Data API (REST, estilo PostgREST).
// Cada request lleva el JWT de Clerk en el header Authorization; Neon valida
// ese token y aplica las políticas de RLS (cada usuario solo ve/edita lo suyo).
export class NeonTransactionRepository implements TransactionRepository {
  private readonly apiUrl: string
  private readonly userId: string
  private readonly getToken: GetToken

  constructor(apiUrl: string, userId: string, getToken: GetToken) {
    this.apiUrl = apiUrl
    this.userId = userId
    this.getToken = getToken
  }

  private async request(path: string, init: RequestInit = {}): Promise<Response> {
    const token = await this.getToken()
    const res = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Error de Neon (${res.status}): ${body}`)
    }
    return res
  }

  private categoryName(categories: CategoryRow[], id: string): string {
    return categories.find(c => c.id === id)?.name ?? id
  }

  private toTransaction(row: TransactionRow, categories: CategoryRow[]): Transaction {
    return {
      id: row.id,
      type: row.type,
      amount: row.amount,
      currency: row.currency,
      categoryId: row.category_id,
      categoryName: this.categoryName(categories, row.category_id),
      account: row.account,
      date: row.date,
      note: row.note ?? undefined,
      paymentMethod: row.payment_method,
    }
  }

  async list(): Promise<Transaction[]> {
    const [txRes, catRes] = await Promise.all([
      this.request('/transactions?order=date.desc'),
      this.request('/categories'),
    ])
    const txs: TransactionRow[] = await txRes.json()
    const cats: CategoryRow[] = await catRes.json()
    return txs.map(row => this.toTransaction(row, cats))
  }

  async add(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const res = await this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        user_id: this.userId,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        category_id: transaction.categoryId,
        account: transaction.account,
        date: transaction.date,
        note: transaction.note ?? null,
        payment_method: transaction.paymentMethod,
      }),
    })
    const [row]: TransactionRow[] = await res.json()
    const catRes = await this.request(`/categories?id=eq.${row.category_id}`)
    const cats: CategoryRow[] = await catRes.json()
    return this.toTransaction(row, cats)
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const res = await this.request(`/transactions?id=eq.${transaction.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        category_id: transaction.categoryId,
        account: transaction.account,
        date: transaction.date,
        note: transaction.note ?? null,
        payment_method: transaction.paymentMethod,
      }),
    })
    const [row]: TransactionRow[] = await res.json()
    const catRes = await this.request(`/categories?id=eq.${row.category_id}`)
    const cats: CategoryRow[] = await catRes.json()
    return this.toTransaction(row, cats)
  }

  async delete(id: string): Promise<void> {
    await this.request(`/transactions?id=eq.${id}`, { method: 'DELETE' })
  }

  async listCategories(type?: TransactionType): Promise<Category[]> {
    const query = type ? `?type=eq.${type}&order=name` : '?order=name'
    const res = await this.request(`/categories${query}`)
    const rows: CategoryRow[] = await res.json()
    return rows.map(row => ({ id: row.id, name: row.name, type: row.type, color: row.color }))
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const res = await this.request('/categories', {
      method: 'POST',
      body: JSON.stringify({
        user_id: this.userId,
        name: category.name,
        type: category.type,
        color: category.color,
      }),
    })
    const [row]: CategoryRow[] = await res.json()
    return { id: row.id, name: row.name, type: row.type, color: row.color }
  }

  async deleteCategory(id: string): Promise<void> {
    const checkRes = await this.request(`/transactions?category_id=eq.${id}&select=id&limit=1`)
    const rows = await checkRes.json()
    if (rows.length > 0) {
      throw new Error('La categoría tiene movimientos asociados y no puede eliminarse.')
    }
    await this.request(`/categories?id=eq.${id}`, { method: 'DELETE' })
  }

  async listByMonth(year: number, month: number): Promise<Transaction[]> {
    const all = await this.list()
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    return all.filter(t => t.date.startsWith(prefix))
  }
}
