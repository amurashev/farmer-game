import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { State } from '../types/state'
import { GRID_LENGTH } from '../config/main'

const slice = createSlice({
  name: 'grid',
  initialState: {
    pointOfView: [14, 20],
    cellSize: 25,
  } satisfies State['grid'],
  reducers: {
    increaseCellSize(state: State['grid']) {
      state.cellSize = Math.floor(state.cellSize + state.cellSize * 0.1)
    },
    reduceCellSize(state: State['grid']) {
      state.cellSize = Math.floor(state.cellSize - state.cellSize * 0.1)
    },
    changePointOfView(
      state: State['grid'],
      action: PayloadAction<{
        side: 'top' | 'left' | 'right' | 'bottom'
      }>
    ) {
      const { side } = action.payload

      if (side === 'left') {
        state.pointOfView = [
          Math.max(0, state.pointOfView[0] - 1),
          state.pointOfView[1],
        ]
      }

      if (side === 'right') {
        state.pointOfView = [
          Math.min(GRID_LENGTH, state.pointOfView[0] + 1),
          state.pointOfView[1],
        ]
      }

      if (side === 'top') {
        state.pointOfView = [
          state.pointOfView[0],
          Math.max(0, state.pointOfView[1] - 1),
        ]
      }

      if (side === 'bottom') {
        state.pointOfView = [
          state.pointOfView[0],
          Math.min(GRID_LENGTH, state.pointOfView[1] + 1),
        ]
      }
    },
  },
})

export const { changePointOfView, increaseCellSize, reduceCellSize } =
  slice.actions
export default slice.reducer
