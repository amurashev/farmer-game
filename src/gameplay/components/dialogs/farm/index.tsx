import { useState, memo, useEffect } from 'react'
import { IoWarning } from 'react-icons/io5'

import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import FarmIcon from '../../../icons/buildings/farm'

import { Farm } from '../../../types/buildings'
import { Day } from '../../../types'
import { getBuildingName } from '../../../utils/buildings'

import ActualProducing from './actual-producing'
import AddProducingForm from './add-form'

const CYCLES_INF = 'inf'

type Props = {
  id: string
  isOpen: boolean
  item?: Farm
  day: Day
  warehouses: { id: string; name?: string }[]
  onClose: () => void
  onApply: (data: {
    productId: string
    power: number
    cycles: number | undefined
    warehouseId: string
  }) => void
  onStop: () => void
}
const arePropsEqual = (prevProps: Props, nextProps: Props) => {
  if (
    JSON.stringify(prevProps.isOpen) === JSON.stringify(nextProps.isOpen) &&
    prevProps.isOpen === false
  ) {
    return true
  }
  return false
}

export default memo(function BuildingDetailsDialog({
  id,
  isOpen,
  item,
  warehouses = [],
  day,
  onClose,
  onApply,
  onStop,
}: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('')
  const [cycles, setCycles] = useState<number | 'inf'>(1)
  const [power, setPower] = useState(1)

  const name = id ? getBuildingName(id) : ''

  const canStart = Boolean(selectedWarehouseId && selectedProductId)
  const hasWarehouses = Boolean(warehouses.length)

  const applyProduction = () => {
    const correctCycles = cycles === CYCLES_INF ? undefined : cycles
    onApply({
      productId: selectedProductId,
      cycles: correctCycles,
      power,
      warehouseId: selectedWarehouseId,
    })
  }

  useEffect(() => {
    if (isOpen) {
      setSelectedProductId('1')

      if (warehouses.length) {
        setSelectedWarehouseId(warehouses[0].id)
      }
    }
  }, [isOpen, warehouses])

  const { producing } = item || {}

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <div className="flex flex-col 1divide-x divide-border space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex-shrink-0">
              <FarmIcon size={124} />
            </div>
            <DialogHeader className="font-semibold">
              <DialogTitle>{name}</DialogTitle>
            </DialogHeader>

            {!hasWarehouses && (
              <Alert variant="warning">
                <IoWarning color="#ffffff" size={20} />
                <AlertTitle>There are no warehouses nearby!</AlertTitle>
                <AlertDescription>
                  You have to build one to start producing
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex-grow space-y-4">
            {producing ? (
              <div>
                <ActualProducing day={day} producing={producing} />
              </div>
            ) : (
              <AddProducingForm
                selectedProductId={selectedProductId}
                selectedWarehouseId={selectedWarehouseId}
                cycles={cycles.toString()}
                power={power.toString()}
                warehouses={warehouses}
                onCycleChange={(value) => setCycles(value as number | 'inf')}
                onPowerChange={(value) => setPower(Number(value))}
                onProductChange={(value) => {
                  setSelectedProductId(value)
                }}
                onWarehouseChange={(value) => setSelectedWarehouseId(value)}
              />
            )}
          </div>

          <div>
            {!producing && (
              <Button
                type="submit"
                className="w-full"
                disabled={!canStart}
                onClick={() => applyProduction()}
              >
                Start production
              </Button>
            )}
            {producing && (
              <Button
                type="submit"
                className="w-full"
                variant="destructive"
                onClick={() => onStop()}
              >
                Stop production
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}, arePropsEqual)
