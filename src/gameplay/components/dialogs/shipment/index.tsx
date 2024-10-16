import { memo, useEffect, useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import transportsData from '../../../data/transports'
import ShipmentsIcon from '../../../icons/shipments'

import SelectCargo from './select-cargo'
import ShipmentItem from './item'

import type { Warehouse } from '../../../types/buildings'
import type { Cargo, Shipment } from '../../../types/transport'
import { type TransportsObject, CargoSlots } from './types'
import { getBuildingName } from '../../../utils/buildings'

function FormRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-3 gap-2 items-start">
      <Label className="min-h-[40px] flex items-center">{label}:</Label>
      {children}
    </div>
  )
}

function FormRowWithSelect({
  label,
  value,
  children,
  onChange,
}: {
  label: string
  value?: string
  children: React.ReactNode
  onChange: (value: string) => void
}) {
  return (
    <FormRow label={label}>
      <Select value={value} onValueChange={(newValue) => onChange(newValue)}>
        <SelectTrigger className="col-span-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </FormRow>
  )
}

const cargoFromSlotsToArray = (cargoSlots: CargoSlots): Cargo[] => {
  return Object.keys(cargoSlots)
    .filter((key) => cargoSlots[key])
    .map((key) => ({
      itemId: cargoSlots[key] as string,
      count: 1,
    }))
}

export default memo(function ShipmentsDialog({
  isOpen,
  shipments,
  warehouses,
  onClose,
  onAddShipment,
  onDeleteShipment,
}: {
  isOpen: boolean
  shipments: Shipment[]
  warehouses: Record<string, Warehouse>
  onClose: () => void
  onAddShipment: (data: {
    from: string
    to: string
    transportId: string
    cargo: Cargo[]
  }) => void
  onDeleteShipment: (id: string) => void
}) {
  const [isAddForm, setIsAddForm] = useState(true)

  const [selectedWarehouseFromId, setSelectedWarehouseFromId] = useState('')
  const [selectedWarehouseToId, setSelectedWarehouseToId] = useState('')
  const [selectedTransportId, setSelectedTransportId] = useState('')
  const [cargoSlots, setCargoSlots] = useState<CargoSlots>({})

  const transports = Object.keys(transportsData).map((id) => transportsData[id]) // TODO

  const selectedTransport = transports.find(
    (item) => item.id === selectedTransportId
  )

  // const warehousesObject = useMemo(() => {
  //   const obj: WarehousesObject = {}
  //   warehouses.forEach((item) => {
  //     obj[item.id] = item
  //   })
  //   return obj
  // }, [warehouses])

  const transportsObject = useMemo(() => {
    const obj: TransportsObject = {}
    transports.forEach((item) => {
      obj[item.id] = item
    })
    return obj
  }, [transports])

  useEffect(() => {
    if (isOpen) {
      setIsAddForm(false)
      setCargoSlots({})
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedTransportId) {
      setCargoSlots({})
    }
  }, [selectedTransportId])

  // console.warn('ShipmentsDialog', shipments, warehousesObject, transportsObject)

  return (
    <Dialog open={isOpen}>
      <DialogContent
        onEscapeKeyDown={onClose}
        onClose={onClose}
        onInteractOutside={onClose}
        className="sm:max-w-[960px]"
      >
        <div className="space-y-4">
          <div className="flex flex-row items-center space-x-1">
            <div className="flex-shrink-0">
              <ShipmentsIcon size={32} />
            </div>
            <DialogHeader className="font-semibold mt-0">
              <DialogTitle className="text-2xl">Shipments</DialogTitle>
            </DialogHeader>
          </div>
          <div>
            {isAddForm && (
              <div className="mt-2 flex flex-col gap-3 py-3">
                <FormRowWithSelect
                  label="From"
                  value={selectedWarehouseFromId}
                  onChange={(value) => setSelectedWarehouseFromId(value)}
                >
                  {Object.keys(warehouses).map((id) => (
                    <SelectItem key={id} value={id}>
                      {getBuildingName(id)}
                    </SelectItem>
                  ))}
                </FormRowWithSelect>

                <FormRowWithSelect
                  label="To"
                  value={selectedWarehouseToId}
                  onChange={(value) => setSelectedWarehouseToId(value)}
                >
                  {Object.keys(warehouses).map((id) => (
                    <SelectItem key={id} value={id}>
                      {getBuildingName(id)}
                    </SelectItem>
                  ))}
                </FormRowWithSelect>

                <FormRowWithSelect
                  label="Transport"
                  value={selectedTransportId}
                  onChange={(value) => setSelectedTransportId(value)}
                >
                  {transports.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      Transport type {item.id} (Capacity {item.capacity})
                    </SelectItem>
                  ))}
                </FormRowWithSelect>

                {selectedTransport && (
                  <FormRow label="Cargo">
                    <SelectCargo
                      capacity={selectedTransport.capacity}
                      cargoSlots={cargoSlots}
                      onSelectItem={(slotIndex, productId) => {
                        setCargoSlots({
                          ...cargoSlots,
                          [slotIndex.toString()]: productId,
                        })
                      }}
                    />
                  </FormRow>
                )}
              </div>
            )}
            {!isAddForm && (
              <div className="min-h-[140px] flex flex-col">
                {shipments.length === 0 ? (
                  <div className="flex items-center justify-center text-center h-full flex-grow">
                    <p className="text-muted-foreground">
                      There are no active shipments
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <th className="w-full table-row space-x-1">
                      <td>&nbsp;</td>
                      <td>From</td>
                      <td>To</td>
                      <td>Status</td>
                      <td>Plan</td>
                      <td>Cargo</td>
                      <td className="p-2">&nbsp;</td>
                    </th>
                    {shipments.map((item) => {
                      return (
                        <ShipmentItem
                          key={item.id}
                          item={item}
                          transportsObject={transportsObject}
                          onDeleteClick={() => onDeleteShipment(item.id)}
                        />
                      )
                    })}
                  </table>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            {isAddForm && (
              <div className="flex space-x-2">
                <Button
                  className="flex-grow"
                  variant="secondary"
                  onClick={() => setIsAddForm(false)}
                >
                  Return to list
                </Button>
                <Button
                  className="flex-grow"
                  onClick={() => {
                    const cargoArray = cargoFromSlotsToArray(cargoSlots)

                    onAddShipment({
                      from: selectedWarehouseFromId,
                      to: selectedWarehouseToId,
                      transportId: selectedTransportId,
                      cargo: cargoArray,
                    })
                    setIsAddForm(false)
                  }}
                >
                  Add shipment
                </Button>
              </div>
            )}
            {!isAddForm && (
              <div>
                <Button onClick={() => setIsAddForm(true)}>Add shipment</Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
