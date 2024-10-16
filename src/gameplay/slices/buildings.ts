import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { defaultBuildings } from '../data/defaultState'

import type { State } from '../types/state'
import type { Building, BuildingType } from '../types/buildings'

const slice = createSlice({
  name: 'buildings',
  initialState: [...defaultBuildings],
  reducers: {
    createBuilding: (
      state: State['buildings'],
      action: PayloadAction<{
        id: string
        name?: string
        type: BuildingType
        position: Building['position']
      }>
    ) => {
      const { id, name, position, type } = action.payload

      return [
        ...state,
        {
          id,
          name,
          type,
          position,
        },
      ]
    },
  },
})

export const { createBuilding } = slice.actions
export default slice.reducer
