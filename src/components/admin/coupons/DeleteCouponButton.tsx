'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { deleteCoupon } from '@/app/actions/coupon'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteCouponButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="tw-text-red-500 hover:tw-text-red-600 hover:tw-bg-red-50"
      onClick={() => {
        if (confirm('Are you sure you want to delete this coupon?')) {
          startTransition(async () => {
            const result = await deleteCoupon(id)
            if (result.error) {
              toast.error(result.error)
            } else {
              toast.success('Coupon deleted successfully')
            }
          })
        }
      }}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="tw-h-4 tw-w-4 tw-animate-spin" />
      ) : (
        <Trash2 className="tw-h-4 tw-w-4" />
      )}
    </Button>
  )
}
