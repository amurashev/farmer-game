import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Warehouse } from '../types/buildings'
import type { State } from '../types/state'
import type { Product } from '../types/products'

const defaultData: Warehouse = {
  capacity: 100,
  products: {},
}

const slice = createSlice({
  name: 'warehouses',
  initialState: {
    'warehouse-1': defaultData,
  } as State['warehouses'],
  reducers: {
    createWarehouse: (
      state: State['warehouses'],
      action: PayloadAction<{
        id: string
      }>
    ) => {
      const { id } = action.payload

      return {
        ...state,
        [id]: defaultData,
      }
    },
    putToWarehouse: (
      state: State['warehouses'],
      action: PayloadAction<{
        warehouseId: string
        productsToPut: Record<Product['id'], number>
      }>
    ) => {
      const { warehouseId, productsToPut } = action.payload

      const newProducts = { ...state[warehouseId].products }
      Object.keys(productsToPut).forEach((productId) => {
        newProducts[productId] = newProducts[productId]
          ? newProducts[productId] + productsToPut[productId]
          : productsToPut[productId]
      })

      return {
        ...state,
        [warehouseId]: {
          ...state[warehouseId],
          products: {
            ...state[warehouseId].products,
            ...newProducts,
          },
        } satisfies Warehouse,
      }
    },
    pickUpFromWarehouse: (
      state: State['warehouses'],
      action: PayloadAction<{
        warehouseId: string
        productsToPickUp: Record<Product['id'], number>
      }>
    ) => {
      const { warehouseId, productsToPickUp } = action.payload

      const newProducts = { ...state[warehouseId].products }
      Object.keys(productsToPickUp).forEach((productId) => {
        let countAfterPickUp = 0

        if (newProducts[productId]) {
          countAfterPickUp =
            newProducts[productId] - productsToPickUp[productId]
        } else {
          countAfterPickUp = 0
        }

        newProducts[productId] = countAfterPickUp
      })

      return {
        ...state,
        [warehouseId]: {
          ...state[warehouseId],
          products: {
            ...state[warehouseId].products,
            ...newProducts,
          },
        } satisfies Warehouse,
      }
    },
  },
})

export const { putToWarehouse, pickUpFromWarehouse, createWarehouse } =
  slice.actions
export default slice.reducer
