import { createSlice } from '@reduxjs/toolkit'

import type { State } from '../types/state'

const slice = createSlice({
  name: 'time',
  initialState: {
    value: 0,
    isPaused: false,
  } as State['time'],
  reducers: {
    increaseTime: (state: State['time']) => {
      return {
        ...state,
        value: state.value + 4,
      }
    },
    togglePause: (state: State['time']) => {
      state.isPaused = !state.isPaused
    },
  },
})

export const { increaseTime, togglePause } = slice.actions
export default slice.reducer
