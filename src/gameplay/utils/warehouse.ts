import { Warehouse } from '../types/buildings'

export const getActualCapacity = (products: Warehouse['products']) =>
  Object.keys(products).reduce((prev, id) => prev + products[id], 0)
