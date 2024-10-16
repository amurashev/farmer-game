import { Transport } from '../types/transport'

const transports: Record<string, Transport> = {
  '1': {
    id: '1',
    type: 1,
    category: 'truck',
    capacity: 1,
    maintenancePrice: 100,
  },
  '2': {
    id: '2',
    type: 2,
    category: 'truck',
    capacity: 2,
    maintenancePrice: 200,
  },
  '3': {
    id: '3',
    type: 3,
    category: 'truck',
    capacity: 4,
    maintenancePrice: 400,
  },
  '4': {
    id: '4',
    type: 4,
    category: 'truck',
    capacity: 8,
    maintenancePrice: 800,
  },
}

export default transports
