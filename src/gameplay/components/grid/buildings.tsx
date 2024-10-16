import Farm from '../buildings/farm'
import Warehouse from '../buildings/warehouse'
import Shop from '../buildings/shop'

import { cn } from '@/lib/utils'

import {
  Farm as FarmType,
  Building,
  Warehouse as WarehouseType,
} from '../../types/buildings'
import Wrapper from './wrapper'

import TownIcon from '../../icons/buildings/town'
import House1Icon from '../../icons/buildings/house1'
import House2Icon from '../../icons/buildings/house2'
import House3Icon from '../../icons/buildings/house3'
import House4Icon from '../../icons/buildings/house4'
import { getBuildingSize } from '../../utils/buildings'

const houseTypes = {
  '1': <House1Icon size="65%" />,
  '2': <House2Icon size="65%" />,
  '3': <House3Icon size="65%" />,
  '4': <House4Icon size="65%" />,
}

export default function Buildings({
  farms,
  warehouses,
  buildings,
  cellSize,
  neighboringWarehouses,
  selectedFarmId,
  selectedWarehouseId,
  day,
  onWarehouseClick,
  onFarmClick,
  onShopClick,
}: {
  farms: Record<string, FarmType>
  warehouses: Record<string, WarehouseType>
  buildings: Building[]
  cellSize: number
  neighboringWarehouses: Record<string, Building[]>
  selectedFarmId?: string
  selectedWarehouseId?: string
  day: number
  onWarehouseClick: (id: string) => void
  onFarmClick: (id: string) => void
  onShopClick: (id: string) => void
}) {
  return (
    <>
      {buildings.map((item) => {
        const iconSize = getBuildingSize(item.type)

        return (
          <Wrapper
            key={item.id}
            position={item.position}
            cellSize={cellSize}
            size={iconSize}
          >
            {item.type === 'warehouse' && (
              <Warehouse
                item={item}
                warehouseData={warehouses[item.id]}
                isSelected={item.id === selectedWarehouseId}
                onClick={() => onWarehouseClick(item.id)}
              />
            )}
            {item.type === 'farm' && (
              <Farm
                day={day}
                item={item}
                farmData={farms[item.id]}
                hasNeighboringWarehouses={Boolean(
                  neighboringWarehouses[item.id]?.length
                )}
                isSelected={item.id === selectedFarmId}
                onClick={() => onFarmClick(item.id)}
              />
            )}
            {item.type === 'shop' && (
              <Shop onClick={() => onShopClick(item.id)} />
            )}
            {item.type === 'hall' && (
              <div
                className={cn(
                  'w-full h-full flex items-center justify-center relative focus-visible:outline-none',
                  {
                    'border border-gray-400/30 rounded-sm bg-[#c6c6bf]': true,
                  }
                )}
              >
                {item.type === 'hall' && <TownIcon size="65%" />}
              </div>
            )}
            {item.type === 'house' && (
              <div
                className={cn(
                  'w-full h-full flex items-center justify-center relative focus-visible:outline-none',
                  {
                    'border border-gray-400/30 rounded-sm bg-[#c6c6bf]': true,
                  }
                )}
              >
                {item.type === 'house' &&
                  houseTypes[
                    item.subType?.toString() as keyof typeof houseTypes
                  ]}
              </div>
            )}
          </Wrapper>
        )
      })}
    </>
  )
}
