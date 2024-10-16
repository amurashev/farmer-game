import * as Progress from '@radix-ui/react-progress'

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <Progress.Root
      className="overflow-hidden h-2 w-full bg-blue-200/10"
      value={progress}
    >
      <Progress.Indicator
        className="h-full w-full flex-1 bg-blue-200/40 transition-all"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  )
}
