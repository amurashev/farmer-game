'use client'

import { useMemo } from 'react'

import StoreProvider from './StoreProvider'

import { Toaster } from './components/ui/toaster'

import DialogsController from './controllers/dialogs'
import TimeController from './controllers/time'
import BuildingsController from './controllers/buildings'
import PanelController from './controllers/panel'
import FarmsLogicController from './controllers/farmsLogic'
import ShopLogicController from './controllers/shopsLogic'
import ShipmentLogicController from './controllers/shipmentLogic'

import { useAppSelector } from './hooks/redux'
import { getAllSegments } from './utils/grid'
import { getPossibleRoads } from './utils/roads'
import {
  getBuildingsByType,
  getGridOfObjects,
  getNeighboringWarehouses,
} from './utils/buildings'

function App() {
  const roads = useAppSelector((state) => state.roads)
  const buildings = useAppSelector((state) => state.buildings)

  const buildingsByType = useMemo(
    () => getBuildingsByType(buildings),
    [buildings]
  )

  const allSegments = useMemo(() => getAllSegments(roads), [roads])
  const possibleRoads = useMemo(
    () => getPossibleRoads(buildingsByType.warehouse, allSegments),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roads, buildingsByType.warehouse]
  )

  const gridOfObjects = useMemo(
    () => getGridOfObjects({ roads, buildings }),
    [roads, buildings]
  )

  const neighboringWarehouses = useMemo(
    () =>
      getNeighboringWarehouses(buildingsByType.farm, buildingsByType.warehouse),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [buildings]
  )

  console.warn('render', gridOfObjects, neighboringWarehouses)

  return (
    <main className="p-0 relative overflow-hidden max-h-[100vh] flex">
      <BuildingsController
        buildingsByType={buildingsByType}
        possibleRoads={possibleRoads}
        neighboringWarehouses={neighboringWarehouses}
      />
      <PanelController />
      <TimeController />
      <DialogsController neighboringWarehouses={neighboringWarehouses} />
      <FarmsLogicController />
      <ShopLogicController />
      <ShipmentLogicController
        possibleRoads={possibleRoads}
        warehouses={buildingsByType.warehouse}
      />

      <Toaster />
    </main>
  )
}

export default function FarmerPage() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  )
}
