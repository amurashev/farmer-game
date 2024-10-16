export default function Wrapper({
  position,
  cellSize,
  children,
  size,
}: {
  position: number[]
  cellSize: number
  size: number
  children: React.ReactNode
}) {
  const [x = 0, y = 0] = position || []
  return (
    <div
      className="absolute"
      style={{
        left: `${x * cellSize}px`,
        top: `${y * cellSize}px`,
        width: `${size * cellSize}px`,
        height: `${size * cellSize}px`,
      }}
    >
      {children}
    </div>
  )
}
