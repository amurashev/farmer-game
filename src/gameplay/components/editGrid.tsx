import throttle from 'lodash.throttle'
import { memo, useState, useEffect } from 'react'

import buildings from '../data/buildings'

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const setFromEvent = (e: any) => {
      // console.warn(e)
      setPosition({ x: e.pageX, y: e.pageY })
    }
    window.addEventListener('mousemove', throttle(setFromEvent, 150))

    return () => {
      window.removeEventListener('mousemove', setFromEvent)
    }
  }, [])

  return position
}

export default memo(function EditGrid({
  cellSize,
  pointOfView,
  item,
  onClick,
}: {
  cellSize: number

  pointOfView: number[]
  item: 'road' | 'farm' | 'warehouse'
  onClick: (point: number[]) => void
}) {
  const { top, left } = document
    .getElementById('grid')
    ?.getBoundingClientRect() || { top: 0, left: 0 }
  const position = useMousePosition()

  const point = [
    Math.floor((position.x - left) / cellSize) + pointOfView[0],
    Math.floor((position.y - top) / cellSize) + pointOfView[1],
  ]

  let objectSize = 1 * cellSize

  if (item === 'warehouse') {
    objectSize = buildings.warehouse.size * cellSize
  }

  if (item === 'farm') {
    objectSize = buildings.farm.size * cellSize
  }

  // console.warn('EditGrid', {
  //   top,
  //   left,
  //   // p1: position.x,
  //   x: position.x,
  //   y: position.y,
  //   point: point.join(';'),
  // })

  return (
    <div
      role="button"
      aria-label="Grid"
      tabIndex={0}
      className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
      onClick={() => {
        onClick(point)
      }}
    >
      <div
        className="h-[1px] w-full left-0 right-0 absolute bg-[#8ece5b]"
        style={{
          left: `${point[0] * cellSize}px`,
          top: `${point[1] * cellSize}px`,
          width: `${objectSize}px`,
          height: `${objectSize}px`,
        }}
      />
    </div>
  )
})
