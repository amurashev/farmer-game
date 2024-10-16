import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { State } from '../types/state'
import type { Shipment, Cargo } from '../types/transport'
import type { Point } from '../types/grid'

const slice = createSlice({
  name: 'shipments',
  initialState: [] as State['shipments'],
  reducers: {
    addShipment: (
      state: State['shipments'],
      action: PayloadAction<{
        from: string
        to: string
        transportId: string
        cargo: Cargo[]
      }>
    ) => {
      const { from, to, transportId, cargo } = action.payload

      return [
        ...state,
        {
          id: Date.now().toString(), // TODO
          from,
          to,
          transportId,
          shouldWait: false,
          cargoPlan: cargo,
          cargoShipment: [],
          position: [],
          status: 'new' as const,
        },
      ]
    },
    updateShipmentStatus: (
      state: State['shipments'],
      action: PayloadAction<{
        id: string
        status: Shipment['status']
        cargo?: Cargo[]
        position: Point
      }>
    ) => {
      const { id, status, cargo, position } = action.payload

      return state.map((item) => {
        if (item.id === id) {
          const newItem = {
            ...item,
            status,
            position,
          } satisfies Shipment

          if (cargo) {
            newItem.cargoShipment = cargo
          }

          return newItem
        }

        return item
      })
    },
    deleteShipment: (
      state: State['shipments'],
      action: PayloadAction<string>
    ) => {
      return state.filter((item) => item.id !== action.payload)
    },
  },
})

export const { addShipment, deleteShipment, updateShipmentStatus } =
  slice.actions
export default slice.reducer
