import { memo, useMemo } from 'react'

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

import ShopIcon from '../../../icons/buildings/shop'
import ProductCard from '../../cards/product'
import Price from '../../ui/price'

import consumption from '../../../data/consumption'

export default memo(function ShopDetailsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const consumptionArray = useMemo(
    () =>
      Object.keys(consumption).map((itemId) => ({
        itemId,
        value: consumption[itemId].value,
        price: consumption[itemId].price,
      })),
    []
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <div className="space-y-4">
          <div className="pr-4 flex flex-col items-center space-y-3">
            <div className="flex-shrink-0">
              <ShopIcon size={124} />
            </div>
            <DialogHeader className="font-semibold mt-2">
              <DialogTitle>Shop</DialogTitle>
            </DialogHeader>
          </div>
          <Separator />
          <div>
            <div className=" items-center justify-between grid grid-cols-12">
              <div className="w-[48px] col-span-2">&nbsp;</div>
              <div className="text-center font-bold col-span-5">
                Consumption
              </div>
              <div className="text-center font-bold col-span-5">Price</div>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {consumptionArray.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center justify-between py-2"
                >
                  <ProductCard itemId={item.itemId} size="sm" />
                  <div>
                    <strong>{item.value}</strong> items / day
                  </div>
                  <div className="flex items-center">
                    <Price value={item.price} />
                    &nbsp;/ item
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
})
