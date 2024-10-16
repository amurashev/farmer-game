import { memo } from 'react'

export default memo(function Paths({
  cellSize,
  possibleRoads,
}: {
  cellSize: number
  possibleRoads: Record<string, number[][]>
}) {
  return (
    <div>
      {Object.keys(possibleRoads).map((path) => {
        const points = possibleRoads[path]

        return (
          <div key={path}>
            {points.map((point, i) => {
              const nextPoint = points[i + 1]
              const [x1, y1] = point

              const cellCenter = cellSize / 2 - 2

              const [x2, y2] = nextPoint || point

              if (x1 === x2) {
                // Vertical line
                return (
                  <div
                    key={`${path}:${x1}:${y1}`}
                    title={`${path}:${x1}:${y1}`}
                    className="absolute w-[4px] h-[4px] bg-red-600 rounded-full"
                    style={{
                      left: `${x1 * cellSize + cellCenter}px`,
                      top: `${y1 * cellSize + cellCenter}px`,
                    }}
                  />
                )
              }

              if (y1 === y2) {
                // Horizontal line
                return (
                  <div
                    key={`${path}:${x1}:${y1}`}
                    title={`${path}:${x1}:${y1}`}
                    className="absolute h-[4px] w-[4px] bg-red-600 rounded-full"
                    style={{
                      left: `${x1 * cellSize + cellCenter}px`,
                      top: `${y1 * cellSize + cellCenter}px`,
                    }}
                  />
                )
              }

              return null
            })}
          </div>
        )
      })}
    </div>
  )
})
