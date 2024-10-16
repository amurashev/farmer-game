import { memo } from 'react'

import { cn } from '@/lib/utils'

import Cell from './cell'
import { Building, Farm } from '../../../types/buildings'
import { getBuildingName } from '../../../utils/buildings'

export default memo(function FarmCell({
  day,
  item,
  farmData,
  isSelected,
  hasNeighboringWarehouses,
  onClick,
}: {
  day: number
  item: Building
  farmData: Farm
  isSelected: boolean
  hasNeighboringWarehouses: boolean
  onClick: () => void
}) {
  const { id } = item
  const { producing } = farmData
  const name = getBuildingName(id)

  return (
    <div className="w-full h-full flex flex-col divide-y-0 divide-[#b4937e] border overflow-hidden border-[#b4937e] rounded-sm">
      <div
        className={cn(
          'h-full relative border-0 border-gray-300 flex flex-wrap overflow-hidden'
        )}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cell) => {
          const isCenter = cell === 4
          const correctIndex = cell > 4 ? cell - 1 : cell

          const isProducingAvailableForCell = Boolean(
            producing && producing?.power > correctIndex
          )

          return (
            <Cell
              key={cell}
              day={day}
              farmName={name}
              producing={producing}
              isBeingUsed={isProducingAvailableForCell}
              isSelected={isSelected}
              hasNeighboringWarehouses={hasNeighboringWarehouses}
              isCenter={isCenter}
              onBaseClick={onClick}
            />
          )
        })}
      </div>
    </div>
  )
})
