import { getWarehouseRoadPoint } from './buildings'
import { getPath } from './grid'

import type { SegmentsData } from './grid'
import type { Building } from '../types/buildings'
import type { PossibleRoads } from '../types/grid'

const ROADS_KEY_CHAR = ','

export const getPossibleRoadsKey = (id1: string, id2: string) =>
  `${id1}${ROADS_KEY_CHAR}${id2}`

export const getPossibleRoads = (
  warehouses: Building[],
  allSegments: SegmentsData
) => {
  const points: Record<string, Building['position']> = {}
  warehouses.forEach((warehouse) => {
    points[warehouse.id] = warehouse.position
  })

  const pairs = warehouses.flatMap((v, i) =>
    warehouses.slice(i + 1).map((w) => getPossibleRoadsKey(v.id, w.id))
  )

  const obj: PossibleRoads = {}
  pairs.forEach((pair) => {
    const [id1, id2] = pair.split(ROADS_KEY_CHAR)
    const w1Point = getWarehouseRoadPoint(points[id1])
    const w2Point = getWarehouseRoadPoint(points[id2])

    const path = getPath({
      allSegments,
      p1: w1Point,
      p2: w2Point,
    })

    obj[pair] = path
    obj[getPossibleRoadsKey(id2, id1)] = [...path].reverse()
  })
  return obj
}
