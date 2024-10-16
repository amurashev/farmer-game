'use client'

import { useCallback } from 'react'

import FarmDetailsDialog from '../components/dialogs/farm'
import WarehouseDetailsDialog from '../components/dialogs/warehouse'
import ShipmentsDialog from '../components/dialogs/shipment'
import ShopDialog from '../components/dialogs/shop'

import { useAppSelector, useAppDispatch } from '../hooks/redux'

import { startProducing, endProducing } from '../slices/farms'
import {
  toggleFarmDetailsModal,
  toggleWarehouseDetailsModal,
  toggleShipmentModal,
  toggleShopModal,
} from '../slices/ui'
import { addShipment, deleteShipment } from '../slices/shipments'
import { Building } from '../types/buildings'

export default function DialogsController({
  neighboringWarehouses,
}: {
  neighboringWarehouses: Record<string, Building[]>
}) {
  const dispatch = useAppDispatch()
  const { farmDetailsId, warehouseDetailsId, shopDetailsId, isShipmentModal } =
    useAppSelector((state) => state.ui)
  const { value: hour } = useAppSelector((state) => state.time)
  const farms = useAppSelector((state) => state.farms)
  const warehouses = useAppSelector((state) => state.warehouses)
  const shipments = useAppSelector((state) => state.shipments)

  const day = Math.floor(hour / 24)

  const selectedWarehouse = warehouseDetailsId
    ? warehouses[warehouseDetailsId]
    : undefined
  const selectedFarm = farmDetailsId ? farms[farmDetailsId] : undefined

  const possibleWarehouses =
    selectedFarm && farmDetailsId ? neighboringWarehouses[farmDetailsId] : []

  return (
    <>
      <WarehouseDetailsDialog
        id={warehouseDetailsId as string}
        isOpen={Boolean(warehouseDetailsId)}
        item={selectedWarehouse}
        onClose={() => dispatch(toggleWarehouseDetailsModal(undefined))}
      />
      <ShopDialog
        isOpen={Boolean(shopDetailsId)}
        onClose={() => dispatch(toggleShopModal(undefined))}
      />
      <ShipmentsDialog
        isOpen={isShipmentModal}
        shipments={shipments}
        warehouses={warehouses}
        onClose={useCallback(() => dispatch(toggleShipmentModal()), [dispatch])}
        onAddShipment={useCallback(
          (data) => {
            dispatch(
              addShipment({
                ...data,
              })
            )
          },
          [dispatch]
        )}
        onDeleteShipment={useCallback(
          (id) => {
            dispatch(deleteShipment(id))
          },
          [dispatch]
        )}
      />
      <FarmDetailsDialog
        id={farmDetailsId as string}
        isOpen={Boolean(farmDetailsId)}
        item={selectedFarm}
        warehouses={possibleWarehouses}
        day={day}
        onClose={useCallback(
          () => dispatch(toggleFarmDetailsModal(undefined)),
          [dispatch]
        )}
        onStop={useCallback(() => {
          dispatch(endProducing({ farmId: farmDetailsId as string }))
        }, [dispatch, farmDetailsId])}
        onApply={useCallback(
          (data) => {
            const { productId, cycles, power, warehouseId } = data
            if (farmDetailsId) {
              dispatch(
                startProducing({
                  day,
                  farmId: farmDetailsId,
                  productId,
                  cycles,
                  power,
                  warehouseId,
                })
              )

              dispatch(toggleFarmDetailsModal(undefined))
            }
          },
          [dispatch, farmDetailsId, day]
        )}
      />
    </>
  )
}
