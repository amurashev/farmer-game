import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { getRandomInteger } from '../utils/random'

import products from '../data/products'

import { State } from '../types/state'
import { Farm, FarmProducing } from '../types/buildings'
import { TIME_BOOST } from '../config/main'

const defaultData: Farm = {
  producing: undefined,
}

const slice = createSlice({
  name: 'farms',
  initialState: {} as State['farms'],
  reducers: {
    createFarm: (
      state: State['farms'],
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
    startProducing: (
      state: State['farms'],
      action: PayloadAction<{
        day: number
        farmId: string
        productId: string
        cycles: number | undefined
        power: number
        warehouseId: string
      }>
    ) => {
      const { farmId, productId, cycles, power, warehouseId, day } =
        action.payload
      const { growthTime } = products[productId]

      const timeFinal = Math.floor(
        getRandomInteger(growthTime[0], growthTime[1]) * TIME_BOOST
      )

      return {
        ...state,
        [farmId]: {
          ...state[farmId],
          producing: {
            status: 'active',
            productId,
            warehouseId,
            startDay: day,
            endDay: day + timeFinal,
            power,
            cycles,
          },
        } satisfies Farm,
      }
    },
    endProducing: (
      state: State['farms'],
      action: PayloadAction<{ farmId: string }>
    ) => {
      const { farmId } = action.payload

      return {
        ...state,
        [farmId]: {
          ...state[farmId],
          producing: undefined,
        } satisfies Farm,
      }
    },
    changeFarmStatus: (
      state: State['farms'],
      action: PayloadAction<{ farmId: string; status: FarmProducing['status'] }>
    ) => {
      const { farmId, status } = action.payload

      return {
        ...state,
        [farmId]: {
          ...state[farmId],
          producing: {
            ...state[farmId].producing,
            status,
          } as Farm['producing'],
        } satisfies Farm,
      }
    },
  },
})

export const { startProducing, endProducing, changeFarmStatus, createFarm } =
  slice.actions
export default slice.reducer
