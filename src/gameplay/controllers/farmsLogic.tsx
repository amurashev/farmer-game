'use client'

import { useEffect } from 'react'

import { useAppStore, useAppDispatch, useAppSelector } from '../hooks/redux'
// import { useToast } from '../hooks/use-toast'

import { startProducing, endProducing, changeFarmStatus } from '../slices/farms'
import { putToWarehouse } from '../slices/warehouses'
import { reduceMoney } from '../slices/money'

import productsData from '../data/products'

import { Farm } from '../types/buildings'
import { getActualCapacity } from '../utils/warehouse'

export default function FarmsLogicController() {
  const appStore = useAppStore()
  const dispatch = useAppDispatch()
  // const { toast } = useToast()
  const { value: hour } = useAppSelector((state) => state.time)
  const farms = useAppSelector((state) => state.farms)

  const day = Math.floor(hour / 24)

  const dayFarmCheck = (farmId: string, farm: Farm) => {
    const { producing } = farm

    if (!producing) return

    const { endDay, productId, cycles, power, warehouseId = '' } = producing
    const itemData = productsData[productId]

    dispatch(reduceMoney(itemData.produceCost * power))

    if (endDay === day) {
      const currentWarehouses = appStore.getState().warehouses
      const { capacity, products } = currentWarehouses[warehouseId]
      const actualCapacity = getActualCapacity(products)
      const productsToPut = {
        [productId]: power,
      }
      const putCapacity = getActualCapacity(productsToPut)

      if (putCapacity + actualCapacity > capacity) {
        dispatch(
          changeFarmStatus({
            farmId,
            status: 'warehouseIsFull',
          })
        )
      } else {
        dispatch(
          putToWarehouse({
            warehouseId,
            productsToPut: {
              [productId]: power,
            },
          })
        )

        if (cycles === undefined || cycles > 1) {
          dispatch(
            startProducing({
              day,
              farmId,
              productId,
              cycles: cycles === undefined ? undefined : cycles - 1,
              power,
              warehouseId,
            })
          )
        } else {
          dispatch(endProducing({ farmId }))
        }

        // const warehouseToMove = warehouses.find(
        //   (item) => item.id === warehouseId
        // )

        // toast({
        //   messageType: 'productMovedToWarehouse',
        //   additional: {
        //     productCount: power,
        //     productId,
        //     productName: itemData.name,
        //     warehouseName: warehouseToMove?.name,
        //   },
        // })
      }
    }
  }

  useEffect(() => {
    if (day !== 0) {
      Object.keys(farms).forEach((farmId) =>
        dayFarmCheck(farmId, farms[farmId])
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day])

  return null
}
