import { useMemo, memo } from 'react'

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { Sheet, SheetContent } from '@/components/ui/sheet'

import WarehouseIcon from '../../../icons/buildings/warehouse'
import ProductCard, { ProductCardCount } from '../../cards/product'

import type { Warehouse } from '../../../types/buildings'
import { getBuildingName } from '../../../utils/buildings'

export default memo(function WarehouseDetailsDialog({
  id,
  isOpen,
  item,
  onClose,
}: {
  id: string
  isOpen: boolean
  item?: Warehouse
  onClose: () => void
}) {
  const { products = {}, capacity } = item || {}
  const name = id ? getBuildingName(id) : ''

  const possibleItemsId = useMemo(
    () =>
      Object.keys(products)
        .filter((productId) => products[productId])
        .map((productId) => productId),
    [products]
  )

  const currentCapacity = useMemo(
    () =>
      Object.keys(products).reduce(
        (prev, productId) => prev + products[productId],
        0
      ),
    [products]
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        {item && (
          <div className="space-y-4">
            <div className="pr-4 flex flex-col items-center">
              <div className="flex-shrink-0">
                <WarehouseIcon size={124} />
              </div>
              <DialogHeader className="font-semibold">
                <DialogTitle>{name}</DialogTitle>
              </DialogHeader>

              <div className="font-bold text-xl mt-1">
                {currentCapacity}/{capacity}
              </div>
            </div>
            <Separator />
            <div className="min-h-[200px] flex flex-col">
              {possibleItemsId.length === 0 ? (
                <div className="flex items-center justify-center text-center h-full flex-grow">
                  <p className="text-muted-foreground">
                    There are no products on the warehouse
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  {possibleItemsId.map((itemId) => (
                    <ProductCard key={itemId} itemId={itemId}>
                      <ProductCardCount count={products[itemId]} />
                    </ProductCard>
                  ))}
                </div>
              )}
            </div>

            <Separator />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
})
