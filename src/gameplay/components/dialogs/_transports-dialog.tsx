import { memo } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import TransportsLogoIcon from '../../icons/transports'

import { Transport } from '../../types/transport'

import transportsData from '../../data/transports'
import TransportCard from '../cards/transport'

export default memo(function TransportsDialog({
  isOpen,
  transports,
  onClose,
}: {
  isOpen: boolean
  transports: Pick<Transport, 'id' | 'type'>[]
  onClose: () => void
}) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-[560px]"
        onClose={onClose}
        onEscapeKeyDown={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        <div className="flex divide-x divide-border sm:min-h-[200px]">
          <div className="pr-4 flex flex-col items-center">
            <div className="flex-shrink-0">
              <TransportsLogoIcon size={124} />
            </div>
            <DialogHeader className="font-semibold mt-3">
              <DialogTitle>Transports</DialogTitle>
            </DialogHeader>
          </div>
          <div className="pl-4 flex-grow">
            {transports.length === 0 ? (
              <div className="h-[100px] flex items-center justify-center text-center">
                {/* <p className="text-muted-foreground">Empty</p> */}
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border w-full">
                {transports.map((item) => {
                  const transportData = transportsData[item.type]
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'relative flex items-center gap-3 py-2 w-full',
                        {
                          'border-border': true,
                        }
                      )}
                    >
                      <TransportCard type={item.type} />

                      <ul className="text-sm flex-grow">
                        <li className="flex justify-between">
                          <strong>Capacity:</strong>
                          <span>{transportData.capacity}</span>
                        </li>
                        <li className="flex justify-between">
                          <strong>Maintenance cost:</strong>
                          <span>{transportData.maintenancePrice} / km</span>
                        </li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
