'use client'

import { updateOrderStatus } from '@/app/actions/order'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTransition } from 'react'
import { toast } from 'sonner'

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (value: string) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('status', value)
      
      const result = await updateOrderStatus(orderId, formData)
      
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="tw-flex tw-items-center tw-gap-3">
      <Select 
        defaultValue={currentStatus} 
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="tw-w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
