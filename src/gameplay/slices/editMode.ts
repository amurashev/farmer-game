import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { State } from '../types/state'

const slice = createSlice({
  name: 'editMode',
  initialState: {
    createItem: null,
  } satisfies State['editMode'],
  reducers: {
    toggleEditModeForItem(
      state: State['editMode'],
      action: PayloadAction<State['editMode']['createItem']>
    ) {
      state.createItem = state.createItem === null ? action.payload : null
    },
  },
})

export const { toggleEditModeForItem } = slice.actions
export default slice.reducer
