import { IoTrashOutline } from 'react-icons/io5'

import { Button } from '@/components/ui/button'

import TransportCard from '../../cards/transport'
import ProductCard, { ProductCardBase } from '../../cards/product'
import transportsData from '../../../data/transports'

import { getBuildingName } from '../../../utils/buildings'

import type { Cargo, Shipment } from '../../../types/transport'
import type { TransportsObject } from './types'

function CargoPlan({
  capacity,
  cargoPlan,
}: {
  capacity: number
  cargoPlan: Cargo[]
}) {
  return (
    <div className="flex flex-wrap max-w-[140px] gap-1">
      {Array.from({ length: capacity }, (_, i) => i).map((i) => {
        if (cargoPlan[i]) {
          return <ProductCard key={i} itemId={cargoPlan[i].itemId} size="xsm" />
        }

        return <ProductCardBase key={i} size="xsm" />
      })}
    </div>
  )
}

function StatusText({
  status,
  idFrom,
  idTo,
}: {
  status: Shipment['status']
  idFrom: string
  idTo: string
}) {
  const warehouseFromName = getBuildingName(idFrom)
  const warehouseToName = getBuildingName(idTo)

  return (
    <div>
      {status === 'goToP1' && `is heading to the "${warehouseFromName}"`}
      {status === 'goToP2' && `is heading to the "${warehouseToName}"`}
      {status === 'collectCargo' &&
        `is picking up cargo at the "${warehouseFromName}"`}
      {status === 'deliverCargo' &&
        `is unloading up cargo at the "${warehouseToName}"`}
    </div>
  )
}

function ShipmentItem({
  item,
  transportsObject,
  onDeleteClick,
}: {
  item: Shipment
  transportsObject: TransportsObject
  onDeleteClick: () => void
}) {
  const transportType = transportsObject[item.transportId].type
  const transportData = transportsData[transportType]

  const warehouseFromName = getBuildingName(item.from)
  const warehouseToName = getBuildingName(item.to)

  return (
    <tr className="w-full table-row border-t border-border space-x-2 text-sm">
      <td>
        <TransportCard size="xsm" type={transportType} />
      </td>
      <td>{warehouseFromName}</td>
      <td>{warehouseToName}</td>
      <td className="w-[30%]">
        <StatusText status={item.status} idFrom={item.from} idTo={item.to} />
      </td>
      <td className="p-1">
        <CargoPlan
          capacity={transportData.capacity}
          cargoPlan={item.cargoPlan}
        />
      </td>
      <td className="p-1">
        <CargoPlan
          capacity={transportData.capacity}
          cargoPlan={item.cargoShipment}
        />
      </td>
      <td className="p-2">
        <Button size="icon" variant="destructive" onClick={onDeleteClick}>
          <IoTrashOutline />
        </Button>
      </td>
    </tr>
  )

  return (
    <div className="py-4 space-y-3">
      <div className="relative flex items-center gap-4 w-full">
        {/* <TransportCard size="sm" type={transportType} /> */}
        <div className="flex flex-col flex-grow w-full space-y-1">
          <div className="text-sm flex">
            <span className="w-1/3">From: </span>
            <strong>{warehouseFromName}</strong>
          </div>
          <div className="text-sm flex">
            <span className="w-1/3">To: </span>
            <strong>{warehouseToName}</strong>
          </div>

          <div className="text-sm flex">
            <span className="w-1/3">Status: </span>
            <StatusText
              status={item.status}
              idFrom={item.from}
              idTo={item.to}
            />
          </div>

          <div className="flex items-center">
            <div className="text-sm w-1/3">Cargo plan:</div>
            <div>
              <CargoPlan
                capacity={transportData.capacity}
                cargoPlan={item.cargoPlan}
              />
            </div>
          </div>
        </div>
        {/* <Button size="icon" variant="destructive" onClick={onDeleteClick}>
          <IoTrashOutline />
        </Button> */}
      </div>
      <div className="flex gap-2 items-center">
        <div className="text-sm">Cargo active:</div>
        <div>
          <div className="flex gap-1">
            <CargoPlan
              capacity={transportData.capacity}
              cargoPlan={item.cargoShipment}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShipmentItem
