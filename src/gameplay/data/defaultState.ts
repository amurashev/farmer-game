import { State } from '../types/state'

export const defaultBuildings = [
  {
    id: 'hall-1',
    name: 'Town Hall',
    type: 'hall',
    position: [30, 30],
  },
  {
    id: 'shop-1',
    type: 'shop',
    position: [34, 30],
  },
  {
    id: 'warehouse-1',
    type: 'warehouse',
    position: [34, 26],
  },
  {
    id: '3',
    type: 'house',
    subType: 1,
    position: [26, 30],
  },
  {
    id: '4',
    type: 'house',
    subType: 3,
    position: [30, 26],
  },
  {
    id: '5',
    type: 'house',
    subType: 2,
    position: [30, 34],
  },
  {
    id: '6',
    type: 'house',
    subType: 1,
    position: [34, 34],
  },
  {
    id: '7',
    type: 'house',
    subType: 2,
    position: [26, 26],
  },
  {
    id: '8',
    type: 'house',
    subType: 3,
    position: [26, 34],
  },
] as State['buildings']
