import type { Transaction, Asset } from '../domain/types'

// Datos de ejemplo para el modo demo (visitantes sin sesión iniciada).
// No se guardan en ningún lado — solo viven en memoria durante la visita.
export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 'demo-1',  type: 'income',  amount: 250000000, currency: 'ARS', categoryId: 'salary',    categoryName: 'Sueldo',       account: 'Efectivo', date: '2026-08-01', note: 'Sueldo agosto',   paymentMethod: 'transfer' },
  { id: 'demo-2',  type: 'expense', amount: 65000000,  currency: 'ARS', categoryId: 'rent',      categoryName: 'Alquiler',     account: 'Efectivo', date: '2026-08-03', note: 'Alquiler agosto', paymentMethod: 'transfer' },
  { id: 'demo-3',  type: 'expense', amount: 4500000,   currency: 'ARS', categoryId: 'groceries', categoryName: 'Supermercado', account: 'Efectivo', date: '2026-08-04', note: 'Coto',            paymentMethod: 'card' },
  { id: 'demo-4',  type: 'expense', amount: 850000,    currency: 'ARS', categoryId: 'transport', categoryName: 'Transporte',   account: 'Efectivo', date: '2026-08-06', note: 'SUBE',            paymentMethod: 'cash' },
  { id: 'demo-5',  type: 'income',  amount: 30000000,  currency: 'ARS', categoryId: 'freelance', categoryName: 'Freelance',    account: 'Efectivo', date: '2026-08-07', note: 'Proyecto landing', paymentMethod: 'transfer' },
  { id: 'demo-6',  type: 'expense', amount: 3820000,   currency: 'ARS', categoryId: 'groceries', categoryName: 'Supermercado', account: 'Efectivo', date: '2026-08-09', note: 'Verdulería',      paymentMethod: 'cash' },
  { id: 'demo-7',  type: 'expense', amount: 600000,    currency: 'ARS', categoryId: 'transport', categoryName: 'Transporte',   account: 'Efectivo', date: '2026-08-10', note: 'Uber',            paymentMethod: 'card' },
  { id: 'demo-8',  type: 'expense', amount: 5200000,   currency: 'ARS', categoryId: 'groceries', categoryName: 'Supermercado', account: 'Efectivo', date: '2026-08-12', note: 'Día',             paymentMethod: 'card' },
  { id: 'demo-9',  type: 'expense', amount: 920000,    currency: 'ARS', categoryId: 'transport', categoryName: 'Transporte',   account: 'Efectivo', date: '2026-08-13', note: 'Nafta',           paymentMethod: 'card' },
  { id: 'demo-10', type: 'income',  amount: 18000000,  currency: 'ARS', categoryId: 'freelance', categoryName: 'Freelance',    account: 'Efectivo', date: '2026-08-15', note: 'Consultoría',     paymentMethod: 'transfer' },
  { id: 'demo-11', type: 'expense', amount: 4150000,   currency: 'ARS', categoryId: 'groceries', categoryName: 'Supermercado', account: 'Efectivo', date: '2026-08-16', note: 'Carrefour',       paymentMethod: 'card' },
  { id: 'demo-12', type: 'expense', amount: 730000,    currency: 'ARS', categoryId: 'transport', categoryName: 'Transporte',   account: 'Efectivo', date: '2026-08-17', note: 'SUBE',            paymentMethod: 'cash' },
  { id: 'demo-13', type: 'expense', amount: 2980000,   currency: 'ARS', categoryId: 'groceries', categoryName: 'Supermercado', account: 'Efectivo', date: '2026-08-18', note: 'Kiosco',          paymentMethod: 'cash' },
  { id: 'demo-14', type: 'expense', amount: 500000,    currency: 'ARS', categoryId: 'transport', categoryName: 'Transporte',   account: 'Efectivo', date: '2026-08-19', note: 'Colectivo',       paymentMethod: 'cash' },
]

export const DEMO_ASSETS: Asset[] = [
  { id: 'demo-asset-1', name: 'Cuenta Galicia',    category: 'cuenta',    value: 180000000, currency: 'ARS', updatedAt: '2026-08-19T12:00:00.000Z' },
  { id: 'demo-asset-2', name: 'Plazo fijo',        category: 'inversion', value: 320000000, currency: 'ARS', updatedAt: '2026-08-15T12:00:00.000Z' },
  { id: 'demo-asset-3', name: 'Departamento',      category: 'propiedad', value: 8500000000, currency: 'ARS', updatedAt: '2026-08-01T12:00:00.000Z' },
]
