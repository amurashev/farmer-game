import { memo, useMemo } from 'react'

import type { Building } from '../types/buildings'
import { getBuildingSize } from '../utils/buildings'

export default memo(function FarmLinks({
  cellSize,
  farms,
  neighboringWarehouses,
}: {
  cellSize: number
  farms: Building[]
  neighboringWarehouses: Record<string, Building[]>
}) {
  const possibleFarms = useMemo(
    () => farms.filter((item) => neighboringWarehouses[item.id]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [farms]
  )

  return (
    <div id="farm-links">
      {possibleFarms.map((farm) => {
        const warehouses = neighboringWarehouses[farm.id]
        const farmSize = getBuildingSize(farm.type)
        const { position } = farm
        const [fX, fY] = position

        return (
          <div key={farm.id}>
            {/* <div
              className="absolute w-[4px] h-[4px] bg-blue-600 rounded-full"
              style={{
                left: `${fX * cellSize + ((cellSize * farmSize) / 2 - 2)}px`,
                top: `${fY * cellSize + ((cellSize * farmSize) / 2 - 2)}px`,
              }}
            /> */}
            {warehouses.map((warehouse) => {
              const { position: warehousePosition } = warehouse
              const [wX, wY] = warehousePosition
              const warehouseSize = getBuildingSize(warehouse.type)
              const thickness = 2

              const x1 = fX * cellSize + ((cellSize * farmSize) / 2 - 0)
              const y1 = fY * cellSize + ((cellSize * farmSize) / 2 - 0)

              const x2 = wX * cellSize + ((cellSize * warehouseSize) / 2 - 0)
              const y2 = wY * cellSize + ((cellSize * warehouseSize) / 2 - 0)

              const length = Math.sqrt(
                (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
              )
              // center
              const cx = (x1 + x2) / 2 - length / 2
              const cy = (y1 + y2) / 2 - thickness / 2
              // angle
              const angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI)

              return (
                <div
                  key={warehouse.id}
                  className="absolute bg-transparent border-[1px] border-dashed border-blue-500"
                  style={{
                    left: `${cx}px`,
                    top: `${cy}px`,
                    width: `${length}px`,
                    height: `${0}px`,
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
})
