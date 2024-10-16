import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { State } from '../types/state'

const slice = createSlice({
  name: 'money',
  initialState: 100000 satisfies State['money'],
  reducers: {
    increaseMoney: (state: State['money'], action: PayloadAction<number>) =>
      state + action.payload,
    reduceMoney: (state: State['money'], action: PayloadAction<number>) =>
      state - action.payload,
  },
})

export const { increaseMoney, reduceMoney } = slice.actions
export default slice.reducer
