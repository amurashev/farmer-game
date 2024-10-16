import { memo } from 'react'

import { cn } from '@/lib/utils'

import ShopIcon from '../../../icons/buildings/shop'

export default memo(function ShopCell({ onClick }: { onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Shop"
      className={cn(
        'w-full h-full flex items-center justify-center relative p-3 focus-visible:outline-none',
        {
          'border border-gray-400/30 rounded-sm bg-[#c6c6bf]': true,
          'hover:bg-[#c5c4b4] cursor-pointer': onClick,
        }
      )}
      onClick={onClick}
    >
      <ShopIcon size="75%" />
    </div>
  )
})
