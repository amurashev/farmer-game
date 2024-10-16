'use client'

import { useEffect } from 'react'

import { useAppStore, useAppDispatch, useAppSelector } from '../hooks/redux'
import { useToast } from '../hooks/use-toast'

import { pickUpFromWarehouse, putToWarehouse } from '../slices/warehouses'
import { updateShipmentStatus } from '../slices/shipments'

import {
  alignAvailableCargo,
  convertCargoFromArrayToObject,
  getAvailableCargoArray,
} from '../utils/shipment'
import { getPossibleRoadsKey } from '../utils/roads'

import type { Shipment } from '../types/transport'
import type { PossibleRoads } from '../types/grid'
import type { Building } from '../types/buildings'

export default function ShipmentLogicController({
  possibleRoads,
  warehouses,
}: {
  possibleRoads: PossibleRoads
  warehouses: Building[]
}) {
  const appStore = useAppStore()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { value: hour } = useAppSelector((state) => state.time)
  const shipments = useAppSelector((state) => state.shipments)

  const dayShipmentCheck = (shipment: Shipment) => {
    const { id, from, to, cargoPlan, cargoShipment, status, position } =
      shipment
    const shipmentPath = possibleRoads[getPossibleRoadsKey(from, to)]

    if (!shipmentPath) {
      return
    }

    if (status === 'new') {
      const warehouseWithPosition = warehouses.find(
        (item) => item.id === from
      ) as Building

      dispatch(
        updateShipmentStatus({
          id,
          status: 'collectCargo',
          position: warehouseWithPosition.position,
        })
      )
    }

    if (status === 'collectCargo') {
      const currentWarehouses = appStore.getState().warehouses
      const currentWarehouse = currentWarehouses[from]
      const cargoObject = convertCargoFromArrayToObject(cargoPlan)
      const cargoObjectAvailable = alignAvailableCargo(
        cargoObject,
        currentWarehouse.products
      )

      dispatch(
        pickUpFromWarehouse({
          warehouseId: from,
          productsToPickUp: cargoObjectAvailable,
        })
      )

      const cargoTookFromWarehouse = getAvailableCargoArray(
        cargoPlan,
        cargoObjectAvailable
      )

      dispatch(
        updateShipmentStatus({
          id,
          status: 'goToP2',
          position: shipmentPath[0],
          cargo: cargoTookFromWarehouse,
        })
      )
    }

    if (status === 'goToP2') {
      const currentPositionIndex = shipmentPath.findIndex(
        (item) => item[0] === position[0] && item[1] === position[1]
      )

      const nextPosition = shipmentPath[currentPositionIndex + 1]
      if (nextPosition) {
        dispatch(
          updateShipmentStatus({
            id,
            status: 'goToP2',
            position: nextPosition,
          })
        )
      } else {
        const warehouseWithPosition = warehouses.find(
          (item) => item.id === to
        ) as Building

        dispatch(
          updateShipmentStatus({
            id,
            status: 'deliverCargo',
            position: warehouseWithPosition.position,
          })
        )
      }
    }

    if (status === 'deliverCargo') {
      const cargoObject = convertCargoFromArrayToObject(cargoShipment)

      dispatch(
        putToWarehouse({
          warehouseId: to,
          productsToPut: cargoObject,
        })
      )
      dispatch(
        updateShipmentStatus({
          id,
          status: 'goToP1',
          position: shipmentPath[shipmentPath.length - 1],
          cargo: [],
        })
      )
    }

    if (status === 'goToP1') {
      const currentPositionIndex = shipmentPath.findIndex(
        (item) => item[0] === position[0] && item[1] === position[1]
      )

      if (shipmentPath[currentPositionIndex - 1]) {
        dispatch(
          updateShipmentStatus({
            id,
            status: 'goToP1',
            position: shipmentPath[currentPositionIndex - 1],
          })
        )
      } else {
        const warehouseWithPosition = warehouses.find(
          (item) => item.id === from
        ) as Building
        dispatch(
          updateShipmentStatus({
            id,
            status: 'collectCargo',
            position: warehouseWithPosition.position,
          })
        )
      }
    }
  }

  useEffect(() => {
    shipments.forEach(dayShipmentCheck)
  }, [hour, warehouses, dispatch, toast, appStore]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
