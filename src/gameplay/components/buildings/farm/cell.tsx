import { memo } from 'react'
import { IoWarning } from 'react-icons/io5'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'

import { FarmProducing } from '../../../types/buildings'

import FarmIcon from '../../../icons/buildings/farm'
import { ProductIcon } from '../../cards/product'

import ProgressBar from './progress-bar'
import products from '../../../data/products'
import { Day } from '../../../types'

type Props = {
  producing?: FarmProducing
  isBeingUsed: boolean
  isCenter: boolean
  isSelected: boolean
  farmName: string
  hasNeighboringWarehouses: boolean
  day: Day
  onBaseClick: () => void
}

const arePropsEqual = () => {
  // if (
  //   JSON.stringify(prevProps.cellState) === JSON.stringify(nextProps.cellState)
  // ) {
  //   return true
  // }
  return false
}

const MIN_ICON_SIZE = 40

export default memo(function Cell({
  producing,
  isBeingUsed,
  isCenter,
  isSelected,
  hasNeighboringWarehouses,
  farmName,
  day,
  onBaseClick,
}: Props) {
  let progress = 0
  let iconSize = MIN_ICON_SIZE

  if (producing) {
    const { startDay, endDay } = producing

    const dGrowth = endDay - startDay
    const dNow = endDay - day

    progress = Math.floor(Math.min((100 * (dGrowth - dNow)) / dGrowth, 100))
    iconSize = MIN_ICON_SIZE + ((100 - MIN_ICON_SIZE) * progress) / 100
  }

  const hasProductionError = producing
    ? ['warehouseIsFull'].includes(producing.status)
    : false
  const hasWarning = hasProductionError || !hasNeighboringWarehouses

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'h-1/3 w-1/3 flex items-center justify-center relative border-[#b4937e] border focus-visible:outline-none',
        {
          'bg-[#92766c]': true,
          'cursor-pointer hover:bg-[#92766c]/80': isCenter,
          'bg-[#92766c]/80': isSelected && isCenter,
        }
      )}
      onClick={() => {
        if (isCenter) {
          onBaseClick()
        }
      }}
    >
      {isCenter ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip open={isSelected}>
            <TooltipTrigger className="flex w-full h-full items-center justify-center relative">
              <FarmIcon size="65%" />
              {hasWarning && (
                <div className="absolute right-0 top-0">
                  <IoWarning size={24} color="#ffca28" />
                </div>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <h3 className="font-bold text-base">{farmName}</h3>
              {producing && (
                <ul className="text-sm">
                  <li>
                    <b>Produces:</b> {products[producing.productId].name}
                  </li>
                  <li>
                    <b>Cycles:</b>{' '}
                    {!producing.cycles ? 'Infinity' : producing.cycles}
                  </li>
                  <li>
                    <b>Power:</b> {producing.power}
                  </li>
                  <li>
                    <b>End in:</b> {producing.endDay - day} days
                  </li>
                </ul>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {producing && isBeingUsed ? (
            <div className="w-[75%] h-[75%] flex items-center justify-center">
              <ProductIcon id={producing.productId} size={`${iconSize}%`} />
            </div>
          ) : null}
        </>
      )}

      {isCenter && producing && (
        <div className="absolute bottom-0 left-0 right-0">
          <ProgressBar progress={progress} />
        </div>
      )}
    </div>
  )
}, arePropsEqual)
