import type { Asset, AssetCategory } from '../../domain/types'

export interface AssetRepository {
  listAssets(): Promise<Asset[]>
  addAsset(asset: Omit<Asset, 'id' | 'updatedAt'>): Promise<Asset>
  updateAsset(asset: Asset): Promise<Asset>
  deleteAsset(id: string): Promise<void>
}

export const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: 'cuenta', label: 'Cuenta bancaria' },
  { value: 'inversion', label: 'Inversión' },
  { value: 'propiedad', label: 'Propiedad' },
  { value: 'vehiculo', label: 'Vehículo' },
  { value: 'otro', label: 'Otro' },
]
