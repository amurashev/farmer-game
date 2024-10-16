import type { Warehouse } from '../types/buildings'
import type { Cargo } from '../types/transport'

type CargoObject = Record<string, number>

export const convertCargoFromArrayToObject = (cargoArray: Cargo[]) => {
  const cargoToObject: CargoObject = {}
  cargoArray.forEach((item) => {
    let countToGet = 0
    const productId = item.itemId

    if (cargoToObject[productId]) {
      countToGet = cargoToObject[productId] + item.count
    } else {
      countToGet = item.count
    }

    cargoToObject[productId] = countToGet
  })

  return cargoToObject
}

export const alignAvailableCargo = (
  cargoToCheck: CargoObject,
  warehouseProducts: Warehouse['products']
) => {
  const newObject: CargoObject = {}

  Object.keys(cargoToCheck).forEach((productId) => {
    const countOnWarehouse = warehouseProducts[productId] || 0
    const cargoCount = cargoToCheck[productId]

    newObject[productId] = Math.min(cargoCount, countOnWarehouse)
  })

  return newObject
}

export const getAvailableCargoArray = (
  cargoPlan: Cargo[],
  cargoObjectAvailable: CargoObject
) => {
  const cargoTookFromWarehouse: Cargo[] = []

  cargoPlan.forEach((item) => {
    if (cargoObjectAvailable[item.itemId] > 0) {
      cargoTookFromWarehouse.push(item)
      cargoObjectAvailable[item.itemId] -= 1
    }
  })

  return cargoTookFromWarehouse
}
