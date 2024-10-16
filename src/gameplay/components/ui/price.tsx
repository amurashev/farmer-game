import IconCoin from '../../icons/ui/coin'

export default function Price({ value }: { value: number }) {
  return (
    <span className="inline">
      <span className="flex items-center space-x-1 font-bold">
        <div>{value}</div>
        <IconCoin size={12} />
      </span>
    </span>
  )
}
