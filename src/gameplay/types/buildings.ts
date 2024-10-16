export type BuildingType =
  | 'hall'
  | 'house'
  | 'shop'
  | 'warehouse'
  | 'farm'
  | 'road'

export type Building = {
  id: string
  type: BuildingType
  position: number[]
  subType?: number
}

export type BuildingsByType = Record<BuildingType, Building[]>

export type Warehouse = {
  capacity: number
  products: Record<string, number>
}

export type FarmProducing = {
  productId: string
  warehouseId?: Building['id']
  startDay: number
  endDay: number
  power: number
  cycles: number | undefined
  status: 'active' | 'noWarehouse' | 'warehouseIsFull'
}

export type Farm = {
  producing?: FarmProducing
}
