import * as SliderPrimitive from '@radix-ui/react-slider'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import productsData, { allProductsId } from '../../../data/products'
import ProductCard from '../../cards/product'
import { getBuildingName } from '../../../utils/buildings'

const CYCLES_INF = 'inf'

export default function AddProducingForm({
  selectedProductId,
  selectedWarehouseId,
  power,
  cycles,
  warehouses,
  onProductChange,
  onCycleChange,
  onPowerChange,
  onWarehouseChange,
}: {
  selectedProductId: string
  selectedWarehouseId: string
  cycles: string
  power: string
  warehouses: { id: string }[]
  onProductChange: (id: string) => void
  onCycleChange: (id: string) => void
  onPowerChange: (id: string) => void
  onWarehouseChange: (id: string) => void
}) {
  const possibleItemsId = allProductsId

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-center">
        {possibleItemsId.map((itemId) => (
          <ProductCard
            key={itemId}
            itemId={itemId}
            className={cn({
              'ring-primary ring-2': itemId === selectedProductId,
            })}
            onClick={() => onProductChange(itemId)}
          />
        ))}
      </div>

      <Separator />

      <ul className="text-sm">
        <li className="flex justify-between">
          <strong>Growth period:</strong>
          <span>
            {productsData[selectedProductId].growthTime[0]}
            &nbsp;&ndash;&nbsp;{
              productsData[selectedProductId].growthTime[1]
            }{' '}
            days
          </span>
        </li>
        <li className="flex justify-between">
          <strong>Produce cost:</strong>
          <span>{productsData[selectedProductId].produceCost} / day</span>
        </li>
      </ul>

      <Separator />

      <div className="grid grid-cols-3 gap-2 items-center">
        <Label>Cycles count:</Label>
        <div className="col-span-2 flex gap-1 justify-between">
          {[1, 3, 5, CYCLES_INF].map((item) => {
            return (
              <Button
                key={item}
                onClick={() => onCycleChange(item.toString())}
                size="icon"
                variant={item.toString() === cycles ? 'default' : 'secondary'}
              >
                {item === CYCLES_INF ? <>&infin;</> : item}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 items-center py-2">
        <Label>Power:</Label>

        <div className="col-span-2">
          <SliderPrimitive.Root
            className={cn(
              'relative flex w-full touch-none select-none items-center'
            )}
            defaultValue={[Number(power)]}
            max={8}
            min={1}
            step={1}
            onValueChange={(value) => onPowerChange(value[0].toString())}
          >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
              <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="cursor-pointer block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
          </SliderPrimitive.Root>
          <div className="flex justify-between mt-2 px-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="font-semibold text-[10px]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 items-center">
        <Label>Warehouse:</Label>
        <Select
          value={selectedWarehouseId}
          onValueChange={(value) => onWarehouseChange(value)}
        >
          <SelectTrigger className="col-span-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {warehouses.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {getBuildingName(item.id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
