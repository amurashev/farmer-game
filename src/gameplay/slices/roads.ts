import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { State } from '../types/state'

const cityRoads = [
  [29, 36],
  [29, 35],
  [29, 34],
  [29, 33],
  [29, 32],
  [29, 31],
  [29, 30],
  [29, 29],
  [29, 28],
  [29, 27],
  [29, 26],
  [29, 25],
  [30, 25],
  [31, 25],
  [32, 25],
  [33, 25],
  [33, 26],
  [33, 27],
  [33, 29],
  [32, 29],
  [31, 29],
  [30, 29],
  [28, 29],
  [27, 29],
  [26, 29],
  [25, 29],
  [25, 30],
  [25, 31],
  [25, 32],
  [25, 33],
  [27, 33],
  [26, 33],
  [28, 33],
  [30, 33],
  [31, 33],
  [32, 33],
  [35, 33],
  [34, 33],
  [37, 33],
  [37, 32],
  [37, 31],
  [37, 30],
  [34, 29],
  [35, 29],
  [36, 29],
  [37, 29],
  [33, 28],
  [33, 33],
  [36, 33],
  [33, 32],
  [33, 31],
  [33, 30],
  [33, 34],
  [33, 35],
  [33, 36],
  [34, 37],
  [37, 36],
  [37, 35],
  [37, 34],
  [35, 37],
  [36, 37],
  [37, 37],
  [30, 37],
  [32, 37],
  [33, 37],
  [31, 37],
  [29, 37],
  [34, 25],
  [35, 25],
  [37, 25],
  [36, 25],
  [37, 26],
  [37, 27],
  [37, 28],
  [25, 28],
  [25, 27],
  [25, 26],
  [25, 25],
  [26, 25],
  [27, 25],
  [28, 25],
  [25, 34],
  [25, 35],
  [25, 36],
  [25, 37],
  [26, 37],
  [27, 37],
  [28, 37],
]

const slice = createSlice({
  name: 'roads',
  initialState: [...cityRoads] as State['roads'],
  reducers: {
    addRoad: (state: State['roads'], action: PayloadAction<number[]>) => [
      ...state,
      action.payload,
    ],
    toggleRoad: (state: State['roads'], action: PayloadAction<number[]>) => {
      const hasRoad = Boolean(
        state.find(
          (item) =>
            item[0] === action.payload[0] && item[1] === action.payload[1]
        )
      )
      if (!hasRoad) {
        return [...state, action.payload]
      }

      return state.filter(
        (item) =>
          !(item[0] === action.payload[0] && item[1] === action.payload[1])
      )
    },
  },
})

export const { addRoad, toggleRoad } = slice.actions
export default slice.reducer
