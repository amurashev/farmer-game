import type { Warehouse } from '../../../types/buildings'
import type { Transport } from '../../../types/transport'
import type { Product } from '../../../types/products'

export type WarehousesObject = Record<string, Warehouse>
export type TransportsObject = Record<string, Pick<Transport, 'id' | 'type'>>
export type CargoSlots = Record<string, Product['id'] | null>
