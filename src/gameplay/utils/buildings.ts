import buildingsData from '../data/buildings'
import { GRID_LENGTH } from '../config/main'

import type { Building, BuildingType } from '../types/buildings'
import type { Point } from '../types/grid'

export const createBuildingId = (type: BuildingType, id: number) =>
  `${type}-${id}`

export const getNumberFromId = (itemId: string) => Number(itemId.split('-')[1])

export const getBuildingName = (itemId: string) => {
  const [type, id] = itemId.split('-')
  if (type === 'shop') return `Grocery shop #${id}`
  if (type === 'farm') return `Farm #${id}`
  if (type === 'warehouse') return `Warehouse #${id}`

  return `Item #${id}`
}

export const getBuildingsByType = (
  buildings: Building[]
): Record<BuildingType, Building[]> => {
  const obj: Record<BuildingType, Building[]> = {
    farm: [],
    warehouse: [],
    hall: [],
    road: [],
    shop: [],
    house: [],
  }

  buildings.forEach((item) => {
    obj[item.type].push(item)
  })

  return obj
}

export const getBuildingSize = (type: Building['type']): number => {
  if (type === 'hall') return buildingsData.hall.size
  if (type === 'shop') return buildingsData.hall.size
  if (type === 'house') return buildingsData.house.size
  if (type === 'farm') return buildingsData.farm.size
  if (type === 'warehouse') return buildingsData.warehouse.size
  if (type === 'road') return 1

  return 1
}

const getFlatPoints = (position: Point, size: number): Point[] => {
  const [x, y] = position
  return [position, [x + size, y], [x + size, y + size], [x, y + size]]
}

export const getGridOfObjects = ({
  roads,
  buildings,
}: {
  roads: Point[]
  buildings: Building[]
}) => {
  const gridMap: Record<string, Record<string, boolean>> = {}
  const flatPoints: Point[][] = []

  const fieldArray = Array.from({ length: GRID_LENGTH }, (_, i) => i)

  fieldArray.forEach((x) => {
    gridMap[x] = {}
    fieldArray.forEach((y) => {
      gridMap[x][y] = false
    })
  })

  buildings.forEach((item) => {
    flatPoints.push(getFlatPoints(item.position, getBuildingSize(item.type)))
  })

  roads.forEach((item) => {
    flatPoints.push(getFlatPoints(item, getBuildingSize('road')))
  })

  return { flatPoints, gridMap }
}

export const getWarehouseRoadPoint = (point: Building['position']): Point => {
  const [x, y] = point
  const warehouseSize = getBuildingSize('warehouse')

  return [x + 1, y + warehouseSize]
}

export const getNeighboringWarehouses = (
  farms: Building[],
  warehouses: Building[]
) => {
  const warehousesWithFlatPoints: {
    index: number
    flatPoints: Point[]
  }[] = []

  warehouses.forEach((item, index) => {
    const flatPoints = getFlatPoints(item.position, getBuildingSize(item.type))
    warehousesWithFlatPoints.push({
      index,
      flatPoints,
    })
  })

  const DELTA = 0
  const finalObject: Record<string, Building[]> = {}

  farms.forEach((item, farmIndex) => {
    const farmFlatPoints = getFlatPoints(
      item.position,
      getBuildingSize(item.type)
    )

    const warehouseIndexes: number[] = []
    for (let i = 0; i < farmFlatPoints.length; i += 1) {
      const [fP1, fP2, fP3, fP4] = farmFlatPoints
      warehousesWithFlatPoints.forEach((warehouse) => {
        const [wP1, wP2, wP3, wP4] = warehouse.flatPoints
        let isCloseByY = false
        let isCloseByX = false

        if (i === 0) {
          isCloseByY = fP1[1] >= wP3[1] && fP1[1] <= wP3[1] + DELTA
          isCloseByX =
            (wP4[0] >= fP1[0] && wP4[0] <= fP2[0]) ||
            (wP3[0] >= fP1[0] && wP3[0] <= fP2[0])
        }
        if (i === 1) {
          isCloseByX = fP2[0] <= wP1[0] && fP2[0] >= wP1[0] - DELTA
          isCloseByY =
            (wP1[1] >= fP2[1] && wP1[1] <= fP3[1]) ||
            (wP4[1] >= fP2[1] && wP4[1] <= fP3[1])
        }
        if (i === 2) {
          isCloseByY = fP3[1] <= wP2[1] && fP3[1] >= wP2[1] - DELTA
          isCloseByX =
            (wP1[0] >= fP4[0] && wP1[0] <= fP3[0]) ||
            (wP2[0] >= fP4[0] && wP2[0] <= fP3[0])
        }
        if (i === 3) {
          isCloseByX = fP4[0] >= wP2[0] && fP4[0] <= wP2[0] + DELTA
          isCloseByY =
            (wP2[1] >= fP1[1] && wP2[1] <= fP4[1]) ||
            (wP3[1] >= fP1[1] && wP3[1] <= fP4[1])
        }

        if (isCloseByY && isCloseByX) warehouseIndexes.push(warehouse.index)
      })
    }

    finalObject[item.id] = warehouseIndexes.map((wIndex) => warehouses[wIndex])

    return {
      farmIndex,
      warehouseIndexes,
    }
  })

  return finalObject
}
