import { sqlite3Worker1Promiser } from '@sqlite.org/sqlite-wasm'
import type { Worker1Promiser } from '@sqlite.org/sqlite-wasm'
import type { Transaction } from '../../domain/types'
import type { TransactionRepository } from '../repositories/TransactionRepository'

const SEED_CATEGORIES = [
  { id: 'salary',    name: 'Sueldo',       type: 'income',  color: '#2FBF71' },
  { id: 'freelance', name: 'Freelance',    type: 'income',  color: '#2FBF71' },
  { id: 'rent',      name: 'Alquiler',     type: 'expense', color: '#E5544B' },
  { id: 'groceries', name: 'Supermercado', type: 'expense', color: '#E5544B' },
  { id: 'transport', name: 'Transporte',   type: 'expense', color: '#E5544B' },
]

const SEED_TRANSACTIONS = [
  { id: '1', type: 'income',  amount: 185_000_000, currency: 'ARS', categoryId: 'salary',    account: 'Banco Galicia', date: '2026-06-01', note: 'Sueldo junio',       paymentMethod: 'transfer' },
  { id: '2', type: 'expense', amount:  42_000_000, currency: 'ARS', categoryId: 'rent',      account: 'Efectivo',      date: '2026-06-05', note: 'Alquiler',           paymentMethod: 'cash'     },
  { id: '3', type: 'expense', amount:   8_730_000, currency: 'ARS', categoryId: 'groceries', account: 'Banco Galicia', date: '2026-06-10', note: 'Supermercado Coto',  paymentMethod: 'card'     },
  { id: '4', type: 'income',  amount:  35_000_000, currency: 'ARS', categoryId: 'freelance', account: 'Banco Galicia', date: '2026-06-12', note: 'Proyecto freelance', paymentMethod: 'transfer' },
  { id: '5', type: 'expense', amount:   5_480_000, currency: 'ARS', categoryId: 'transport', account: 'Efectivo',      date: '2026-06-15', note: 'Nafta',              paymentMethod: 'cash'     },
]

export class SqliteTransactionRepository implements TransactionRepository {
  private constructor(private readonly promiser: Worker1Promiser) {}

  static async create(): Promise<SqliteTransactionRepository> {
    const promiser = await sqlite3Worker1Promiser({
      worker: () => new Worker(
        new URL('../../workers/sqlite.worker.ts', import.meta.url),
        { type: 'module' },
      ),
    })

    await promiser('open', {
      filename: 'file:time-is-money.db?vfs=opfs-sahpool',
    })

    const repo = new SqliteTransactionRepository(promiser)
    await repo.ensureSchema()
    return repo
  }

  private async ensureSchema(): Promise<void> {
    await this.promiser('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id           TEXT PRIMARY KEY,
          name         TEXT NOT NULL,
          type         TEXT NOT NULL,
          color        TEXT NOT NULL DEFAULT ''
        );
        CREATE TABLE IF NOT EXISTS transactions (
          id             TEXT    PRIMARY KEY,
          type           TEXT    NOT NULL,
          amount         INTEGER NOT NULL,
          currency       TEXT    NOT NULL DEFAULT 'ARS',
          category_id    TEXT    NOT NULL,
          account        TEXT    NOT NULL,
          date           TEXT    NOT NULL,
          note           TEXT,
          payment_method TEXT    NOT NULL
        );
      `,
    })
    await this.seedIfEmpty()
  }

  private async seedIfEmpty(): Promise<void> {
    const { result } = await this.promiser('exec', {
      sql: 'SELECT COUNT(*) AS count FROM transactions',
      returnValue: 'resultRows',
      rowMode: 'object',
    })

    const rows = result.resultRows as Array<Record<string, number>>
    if ((rows[0]?.count ?? 0) > 0) return

    for (const cat of SEED_CATEGORIES) {
      await this.promiser('exec', {
        sql: 'INSERT INTO categories (id, name, type, color) VALUES (?, ?, ?, ?)',
        bind: [cat.id, cat.name, cat.type, cat.color],
      })
    }

    for (const t of SEED_TRANSACTIONS) {
      await this.promiser('exec', {
        sql: `INSERT INTO transactions
              (id, type, amount, currency, category_id, account, date, note, payment_method)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        bind: [t.id, t.type, t.amount, t.currency, t.categoryId, t.account, t.date, t.note, t.paymentMethod],
      })
    }
  }

  async list(): Promise<Transaction[]> {
    const { result } = await this.promiser('exec', {
      sql: `
        SELECT
          t.id, t.type, t.amount, t.currency,
          t.category_id, t.account, t.date, t.note, t.payment_method,
          COALESCE(c.name, t.category_id) AS category_name
        FROM transactions t
        LEFT JOIN categories c ON c.id = t.category_id
        ORDER BY t.date DESC
      `,
      returnValue: 'resultRows',
      rowMode: 'object',
    })

    const rows = (result.resultRows ?? []) as Array<Record<string, string | number | null>>
    return rows.map(row => ({
      id:            String(row.id),
      type:          row.type as Transaction['type'],
      amount:        Number(row.amount),
      currency:      String(row.currency),
      categoryId:    String(row.category_id),
      categoryName:  String(row.category_name ?? row.category_id),
      account:       String(row.account),
      date:          String(row.date),
      note:          row.note != null ? String(row.note) : undefined,
      paymentMethod: row.payment_method as Transaction['paymentMethod'],
    }))
  }
}
