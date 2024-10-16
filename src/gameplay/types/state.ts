import { Farm, Building, Warehouse } from './buildings'
import { Shipment } from './transport'

export type State = {
  time: {
    value: number
    isPaused: boolean
  }
  money: number
  grid: {
    pointOfView: number[]
    cellSize: number
  }
  ui: {
    farmDetailsId?: string
    warehouseDetailsId?: string
    shopDetailsId?: string
    isShipmentModal: boolean
    hasPaths: boolean
  }
  editMode: {
    createItem: 'road' | 'farm' | 'warehouse' | null
  }
  roads: number[][]
  farms: Record<string, Farm>
  warehouses: Record<string, Warehouse>
  shipments: Shipment[]
  buildings: Building[]
}
