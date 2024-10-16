import {
  DropdownMenuPortal,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

import { allProductsId } from '../../../data/products'

import ProductCard from '../../cards/product'

export default function DropdownListOfProducts({
  onInteractOutside,
  onSelectItem,
}: {
  onSelectItem: (id: string) => void
  onInteractOutside: () => void
}) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuContent
        align="center"
        side="bottom"
        onInteractOutside={onInteractOutside}
      >
        <div className="p-2 pt-1">
          <h2 className="font-bold">Select product</h2>
          <div className="grid grid-cols-3 gap-2 w-full mt-2">
            {allProductsId.map((itemId) => {
              return (
                <ProductCard
                  key={itemId}
                  itemId={itemId}
                  onClick={() => {
                    onSelectItem(itemId)
                  }}
                />
              )
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  )
}
