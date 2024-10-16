const buildings: Record<
  'farm' | 'warehouse' | 'shop' | 'hall' | 'house',
  {
    size: number
  }
> = {
  farm: {
    size: 6,
  },
  warehouse: {
    size: 3,
  },
  shop: {
    size: 3,
  },
  hall: {
    size: 3,
  },
  house: {
    size: 3,
  },
}

export default buildings
