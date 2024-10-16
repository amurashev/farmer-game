import productsData from '../../../data/products'

import ProductCard from '../../cards/product'
import { FarmProducing } from '../../../types/buildings'
import { Day } from '../../../types'

export default function ActualProducing({
  producing,
  day,
}: {
  producing: FarmProducing
  day: Day
}) {
  return (
    <div className="border border-border p-2 bg-green-600/10 flex gap-2 items-start rounded-sm">
      <ProductCard itemId={producing.productId} />
      <div>
        <ul className="text-sm">
          <li>
            <b>Produces:</b> {productsData[producing.productId].name}
          </li>
          <li>
            <b>Cycles:</b> {!producing.cycles ? 'Infinity' : producing.cycles}
          </li>
          <li>
            <b>Power:</b> {producing.power}
          </li>
          <li>
            <b>End in:</b> {producing.endDay - day} days
          </li>
        </ul>
      </div>
    </div>
  )
}
