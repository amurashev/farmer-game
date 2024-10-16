import { memo } from 'react'

import { Shipment } from '../../types/transport'
import { TransportIcon } from '../cards/transport'

import Wrapper from './wrapper'
import ProductCard from '../cards/product'

export default memo(function ShipmentOnGrid({
  cellSize,
  item,
}: {
  cellSize: number
  item: Shipment
}) {
  const { position, cargoShipment } = item
  return (
    <Wrapper position={position} cellSize={cellSize} size={1}>
      <div className="flex items-center justify-center p-1 relative">
        <div className="bg-background border-gray-800 border h-full w-full p-[1px] rounded-sm flex items-center justify-center">
          <TransportIcon id={item.transportId} size="100%" />
        </div>

        {cargoShipment.length > 0 && (
          <div className="absolute top-[-14px] left-[100%] flex flex-wrap w-[84px] space-x-[1px]">
            {cargoShipment.map((product, key) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={key} className="border-gray-400 border rounded-sm">
                <ProductCard size="xxsm" itemId={product.itemId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  )
})
