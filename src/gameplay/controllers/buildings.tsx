import { useCallback } from 'react'

import { useAppSelector, useAppDispatch } from '../hooks/redux'

import Grid from '../components/grid'
import Roads from '../components/grid/roads'
import Paths from '../components/grid/paths'
import EditGrid from '../components/editGrid'
import ShipmentOnGrid from '../components/grid/shipment'
import Buildings from '../components/grid/buildings'
import FarmLinks from '../components/farmLinks'

import {
  toggleWarehouseDetailsModal,
  toggleFarmDetailsModal,
  toggleShopModal,
} from '../slices/ui'
import { createWarehouse } from '../slices/warehouses'
import { createFarm } from '../slices/farms'
import { toggleRoad } from '../slices/roads'
import { createBuilding } from '../slices/buildings'
import { toggleEditModeForItem } from '../slices/editMode'

import { GRID_LENGTH } from '../config/main'
import { createBuildingId, getNumberFromId } from '../utils/buildings'

import type { PossibleRoads } from '../types/grid'
import type { Building, BuildingsByType } from '../types/buildings'

export default function BuildingsController({
  possibleRoads,
  buildingsByType,
  neighboringWarehouses,
}: {
  buildingsByType: BuildingsByType
  possibleRoads: PossibleRoads
  neighboringWarehouses: Record<string, Building[]>
}) {
  const dispatch = useAppDispatch()
  const farms = useAppSelector((state) => state.farms)
  const { value: hour } = useAppSelector((state) => state.time)
  const roads = useAppSelector((state) => state.roads)
  const shipments = useAppSelector((state) => state.shipments)
  const warehouses = useAppSelector((state) => state.warehouses)
  const buildings = useAppSelector((state) => state.buildings)
  const { cellSize, pointOfView } = useAppSelector((state) => state.grid)
  const { hasPaths, farmDetailsId, warehouseDetailsId } = useAppSelector(
    (state) => state.ui
  )
  const { createItem } = useAppSelector((state) => state.editMode)

  const day = Math.floor(hour / 24)

  const onCreateItem = useCallback(
    (point: number[]) => {
      if (createItem === 'road') dispatch(toggleRoad(point))

      if (createItem === 'warehouse') {
        const maxId = Math.max(
          ...buildingsByType.warehouse.map((item) => getNumberFromId(item.id)),
          0
        )
        const id = createBuildingId('warehouse', maxId + 1)
        dispatch(
          createBuilding({
            id,
            type: 'warehouse',
            position: point,
          })
        )

        dispatch(createWarehouse({ id }))
        dispatch(toggleEditModeForItem(null))
      }

      if (createItem === 'farm') {
        const maxId = Math.max(
          ...buildingsByType.farm.map((item) => getNumberFromId(item.id)),
          0
        )
        const id = createBuildingId('farm', maxId + 1)
        dispatch(
          createBuilding({
            id,
            type: 'farm',
            position: point,
          })
        )

        dispatch(createFarm({ id }))
        dispatch(toggleEditModeForItem(null))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createItem]
  )

  return (
    <div
      className="bg-[#bfda95] border border-[#b1ce85] p-20 overflow-hidden"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <div
        className="relative"
        id="grid"
        style={{
          width: `${GRID_LENGTH * cellSize + 1}px`,
          height: `${GRID_LENGTH * cellSize + 1}px`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
          style={{
            top: `${pointOfView[1] * cellSize * -1}px`,
            left: `${pointOfView[0] * cellSize * -1}px`,
          }}
        >
          <Grid cellSize={cellSize} />

          {createItem && (
            <EditGrid
              item={createItem}
              cellSize={cellSize}
              pointOfView={pointOfView}
              onClick={onCreateItem}
            />
          )}

          <Buildings
            farms={farms}
            warehouses={warehouses}
            buildings={buildings}
            cellSize={cellSize}
            day={day}
            neighboringWarehouses={neighboringWarehouses}
            selectedFarmId={farmDetailsId}
            selectedWarehouseId={warehouseDetailsId}
            onWarehouseClick={useCallback(
              (itemId) => {
                dispatch(toggleWarehouseDetailsModal(itemId))
              },
              [dispatch]
            )}
            onFarmClick={useCallback(
              (itemId) => {
                dispatch(toggleFarmDetailsModal(itemId))
              },
              [dispatch]
            )}
            onShopClick={useCallback(
              (itemId) => {
                dispatch(toggleShopModal(itemId))
              },
              [dispatch]
            )}
          />

          <Roads
            roads={roads}
            cellSize={cellSize}
            mode={createItem === 'road' ? 'edit' : 'regular'}
            onRoadClick={useCallback(
              (point) => {
                if (createItem === 'road') {
                  dispatch(toggleRoad(point))
                }
              },
              [createItem, dispatch]
            )}
          />

          {hasPaths && (
            <Paths cellSize={cellSize} possibleRoads={possibleRoads} />
          )}

          {shipments.map((item) => (
            <ShipmentOnGrid key={item.id} item={item} cellSize={cellSize} />
          ))}

          <FarmLinks
            cellSize={cellSize}
            farms={buildingsByType.farm}
            neighboringWarehouses={neighboringWarehouses}
          />
        </div>
      </div>
    </div>
  )
}
