'use client'

import { useEffect } from 'react'

import { useAppStore, useAppDispatch, useAppSelector } from '../hooks/redux'

import { pickUpFromWarehouse } from '../slices/warehouses'
import { increaseMoney } from '../slices/money'

import consumptionData from '../data/consumption'

export default function ShopLogicController() {
  const appStore = useAppStore()
  const dispatch = useAppDispatch()
  const { value: hour } = useAppSelector((state) => state.time)

  const day = Math.floor(hour / 24)

  const cityWarehouseId = 'warehouse-1' // TODO

  function applyConsumption() {
    const currentWarehouses = appStore.getState().warehouses
    const cityWarehouse = currentWarehouses[cityWarehouseId]
    const { products } = cityWarehouse

    const productsToPickUp: Record<string, number> = {}
    let profit = 0

    Object.keys(consumptionData).forEach((itemId) => {
      const consumption = consumptionData[itemId]
      const possibleReduce = products[itemId]
        ? Math.min(consumption.value, products[itemId])
        : 0

      productsToPickUp[itemId] = possibleReduce
      profit += possibleReduce * consumption.price
    })

    dispatch(
      pickUpFromWarehouse({
        warehouseId: cityWarehouseId,
        productsToPickUp,
      })
    )

    dispatch(increaseMoney(profit))
  }

  useEffect(() => {
    if (day !== 0) {
      applyConsumption()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day])

  return null
}
