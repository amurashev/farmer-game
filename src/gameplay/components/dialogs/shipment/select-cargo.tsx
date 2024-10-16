import { useState } from 'react'
import { IoAdd } from 'react-icons/io5'

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import ProductCard, { ProductCardBase } from '../../cards/product'

import DropdownListOfProducts from './products-list'

import type { CargoSlots } from './types'

export default function SelectCargo({
  capacity,
  cargoSlots,
  onSelectItem,
}: {
  capacity: number
  cargoSlots: CargoSlots
  onSelectItem: (slotIndex: number, productId: string | null) => void
}) {
  const [openedItem, setOpenedItem] = useState<null | number>(null)

  return (
    <div className="col-span-2 flex flex-wrap gap-2">
      {Array.from({ length: capacity }, (_, i) => i + 1).map((slotIndex) => (
        <DropdownMenu open={openedItem === slotIndex} key={slotIndex}>
          <DropdownMenuTrigger asChild key={slotIndex}>
            {cargoSlots[slotIndex] ? (
              <ProductCard
                key={slotIndex}
                size="sm"
                itemId={cargoSlots[slotIndex]}
                onClick={() => onSelectItem(slotIndex, null)}
              />
            ) : (
              <ProductCardBase
                key={slotIndex}
                size="sm"
                onClick={() => setOpenedItem(slotIndex)}
              >
                <IoAdd color="#aaaaaa" size={32} />
              </ProductCardBase>
            )}
          </DropdownMenuTrigger>
          <DropdownListOfProducts
            onSelectItem={(productId) => {
              onSelectItem(slotIndex, productId)
              setOpenedItem(null)
            }}
            onInteractOutside={() => {
              setOpenedItem(null)
            }}
          />
        </DropdownMenu>
      ))}
    </div>
  )
}
