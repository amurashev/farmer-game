import { memo, forwardRef } from 'react'

import { cn } from '@/lib/utils'

import Carrot from '../../icons/products/carrot'
import Cabbage from '../../icons/products/cabbage'
import Pumpkin from '../../icons/products/pumpkin'
import Corn from '../../icons/products/corn'

const mapItemIcon = {
  '1': Carrot,
  '2': Cabbage,
  '3': Corn,
  '4': Pumpkin,
}

export function ProductIcon({
  size = '100%',
  id,
}: {
  id: string
  size?: string
}) {
  const IconComponent = mapItemIcon[id as keyof typeof mapItemIcon]
  return IconComponent ? <IconComponent size={size} /> : <div>null</div>
}

export function ProductCardCount({ count = 0 }: { count: number }) {
  return (
    <div className="flex items-center justify-center absolute bottom-1 text-[10px] shadow-sm shadow-gray-200 right-1 font-bold bg-background min-w-4 px-1 h-4 rounded-sm select-none">
      x{count}
    </div>
  )
}

type Props = {
  children?: React.ReactNode
  className?: string
  size?: 'md' | 'sm' | 'xsm' | 'xxsm'
  onClick?: () => void
}

export const ProductCardBase = forwardRef<HTMLButtonElement, Props>(
  ({ size = 'md', className, children, onClick }, ref) => {
    const isClickable = Boolean(onClick)
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          'relative bg-muted border rounded-sm flex items-center justify-center',
          {
            'w-[64px] h-[64px] p-3': size === 'md',
            'w-[48px] h-[48px] p-2': size === 'sm',
            'w-[32px] h-[32px] p-1': size === 'xsm',
            'w-[18px] h-[18px] p-[1px]': size === 'xxsm',
            'cursor-pointer': isClickable,
            'cursor-auto': !isClickable,
          },
          className
        )}
      >
        {children}
      </button>
    )
  }
)

const ProductCardComponent = forwardRef<
  HTMLButtonElement,
  Props & {
    itemId: string
  }
>(({ itemId, children, ...props }, ref) => {
  return (
    <ProductCardBase ref={ref} {...props}>
      {itemId && <ProductIcon id={itemId} />}
      {children}
    </ProductCardBase>
  )
})

ProductCardComponent.displayName = 'ProductCard'

const ProductCard = memo(ProductCardComponent)

export default ProductCard
