import { useEffect } from 'react'

import {
  IoCaretBackOutline,
  IoCaretForwardOutline,
  IoCaretDownOutline,
  IoCaretUpOutline,
  IoRemove,
  IoAdd,
  IoPauseSharp,
} from 'react-icons/io5'

import { useAppSelector, useAppDispatch } from '../hooks/redux'

import Coin from '../icons/ui/coin'
import ShipmentsIcon from '../icons/shipments'
import RoadIcon from '../icons/buildings/road'
import FarmIcon from '../icons/buildings/farm'
import WarehouseIcon from '../icons/buildings/warehouse'

import { toggleShipmentModal } from '../slices/ui'
import { togglePause } from '../slices/time'
import { toggleEditModeForItem } from '../slices/editMode'
import {
  changePointOfView,
  increaseCellSize,
  reduceCellSize,
} from '../slices/grid'
import { cn } from '@/lib/utils'

function Wrapper({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('bg-primary/20 py-2 px-4 rounded-md', className)}>
      {children}
    </div>
  )
}

function MenuButton({
  title,
  isActive,
  children,
  onClick,
}: {
  title: string
  isActive: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      className={cn(
        '1bg-primary/20 w-[36px] h-[36px] p-2 rounded-md cursor-pointer flex items-center justify-center',
        {
          // 'bg-primary/20': !isActive,
          'bg-blue-600/40': isActive,
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function PositionButton({
  label,
  children,
  className,
  onClick,
}: {
  label: string
  className?: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn('bg-primary/20 p-2 rounded-md cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default function Panel() {
  const dispatch = useAppDispatch()
  const money = useAppSelector((state) => state.money)
  const { value: hour, isPaused } = useAppSelector((state) => state.time)
  const { createItem } = useAppSelector((state) => state.editMode)

  const day = Math.floor(hour / 24)

  useEffect(() => {
    const keyboardEvents = function (e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        dispatch(changePointOfView({ side: 'bottom' }))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        dispatch(changePointOfView({ side: 'top' }))
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        dispatch(changePointOfView({ side: 'left' }))
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        dispatch(changePointOfView({ side: 'right' }))
      }

      if (e.key === '-') {
        e.preventDefault()
        dispatch(reduceCellSize())
      }

      if (e.key === '=') {
        e.preventDefault()
        dispatch(increaseCellSize())
      }
    }

    document.addEventListener('keydown', keyboardEvents)

    return () => {
      document.removeEventListener('keydown', keyboardEvents)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="fixed bottom-2 left-2">
        <Wrapper className="flex items-center gap-2">
          <Coin size={16} />
          <div className="text-sm text-background font-bold">{money}</div>
        </Wrapper>
      </div>

      <div className="fixed bottom-2 right-2">
        <Wrapper className="flex items-center gap-2 text-background">
          <div className="text-sm font-bold">
            Hour: {hour % 24}:00, Day: {day}
          </div>
          <button
            type="button"
            aria-label="Pause"
            title="Pause"
            onClick={() => dispatch(togglePause())}
          >
            {isPaused ? (
              <IoCaretForwardOutline size={22} />
            ) : (
              <IoPauseSharp size={22} />
            )}
          </button>
        </Wrapper>
      </div>

      <div className="fixed bottom-2 left-[50%] translate-x-[-50%]">
        <div className="flex space-x-2">
          <Wrapper className="flex items-stretch gap-2 px-2">
            <MenuButton
              title="Roads"
              isActive={createItem === 'road'}
              onClick={() => dispatch(toggleEditModeForItem('road'))}
            >
              <RoadIcon size={24} fill="#333333" />
            </MenuButton>

            <MenuButton
              title="Warehouse"
              isActive={createItem === 'warehouse'}
              onClick={() => dispatch(toggleEditModeForItem('warehouse'))}
            >
              <WarehouseIcon size={24} />
            </MenuButton>

            <MenuButton
              title="Farm"
              isActive={createItem === 'farm'}
              onClick={() => dispatch(toggleEditModeForItem('farm'))}
            >
              <FarmIcon size={24} />
            </MenuButton>
          </Wrapper>
          <Wrapper className="px-2">
            <MenuButton
              title="Shipment"
              isActive={false}
              onClick={() => dispatch(toggleShipmentModal())}
            >
              <ShipmentsIcon size={38} />
            </MenuButton>
          </Wrapper>
        </div>
      </div>

      <div className="fixed top-2 left-2">
        <div className="relative w-[96px] h-[96px]">
          <PositionButton
            label="Left"
            className="absolute top-[50%] left-0 translate-y-[-50%]"
            onClick={() => dispatch(changePointOfView({ side: 'left' }))}
          >
            <IoCaretBackOutline size={16} />
          </PositionButton>

          <PositionButton
            label="Right"
            className="absolute top-[50%] right-0 translate-y-[-50%]"
            onClick={() => dispatch(changePointOfView({ side: 'right' }))}
          >
            <IoCaretForwardOutline size={16} />
          </PositionButton>

          <PositionButton
            label="Bottom"
            className="absolute bottom-0 left-[50%] translate-x-[-50%]"
            onClick={() => dispatch(changePointOfView({ side: 'bottom' }))}
          >
            <IoCaretDownOutline size={16} />
          </PositionButton>
          <PositionButton
            label="Top"
            className="absolute top-0 left-[50%] translate-x-[-50%]"
            onClick={() => dispatch(changePointOfView({ side: 'top' }))}
          >
            <IoCaretUpOutline size={16} />
          </PositionButton>
        </div>

        <div className="mt-2 flex justify-around">
          <PositionButton
            aria-label="Left"
            label="Zoom in"
            className=""
            onClick={() => dispatch(increaseCellSize())}
          >
            <IoAdd size={16} />
          </PositionButton>
          <PositionButton
            label="Zoom out"
            className=""
            onClick={() => dispatch(reduceCellSize())}
          >
            <IoRemove size={16} />
          </PositionButton>
        </div>
      </div>
    </div>
  )
}
