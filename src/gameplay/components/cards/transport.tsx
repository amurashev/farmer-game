import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import Truck1 from '../../icons/transports/truck1'
import Truck2 from '../../icons/transports/truck2'
import Truck3 from '../../icons/transports/truck3'
import Truck4 from '../../icons/transports/truck4'

const mapItemIcon = {
  '1': Truck1,
  '2': Truck2,
  '3': Truck3,
  '4': Truck4,
}

export function TransportIcon({
  size = '100%',
  id,
}: {
  id: string
  size?: string
}) {
  const IconComponent = mapItemIcon[id as keyof typeof mapItemIcon]
  return IconComponent ? <IconComponent size={size} /> : <div>null</div>
}

type Props = {
  type: number
  size?: 'md' | 'sm' | 'xsm'
}

const TransportCard = forwardRef<HTMLDivElement, Props>(
  ({ type, size = 'md' }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'pr-1 w-[64px] h-[64px] bg-muted border p-2 rounded-sm flex-shrink-0',
          {
            'w-[64px] h-[64px]': size === 'md',
            'w-[48px] h-[48px] p-2': size === 'sm',
            'w-[32px] h-[32px] p-1': size === 'xsm',
          }
        )}
      >
        <TransportIcon id={type.toString()} />
      </div>
    )
  }
)

export default TransportCard
