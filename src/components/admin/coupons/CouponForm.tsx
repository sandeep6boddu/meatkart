'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCoupon, updateCoupon, type CouponState } from '@/app/actions/coupon'
import { Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type CouponFormProps = {
  coupon?: {
    id: string
    code: string
    description?: string | null
    discountType: string
    discountValue: number
    minOrderValue?: number | null
    maxDiscount?: number | null
    startDate: Date
    endDate?: Date | null
    usageLimit?: number | null
    perUserLimit?: number | null
    isActive: boolean
  }
}

export function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter()
  
  const updateCouponWithId = coupon 
    ? updateCoupon.bind(null, coupon.id) 
    : createCoupon

  const [state, formAction, isPending] = useActionState(updateCouponWithId, null)

  return (
    <form action={formAction} className="tw-space-y-8 tw-max-w-2xl">
      <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100 tw-space-y-6">
        
        <div className="tw-grid tw-grid-cols-2 tw-gap-6">
          <div className="tw-space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input
              id="code"
              name="code"
              defaultValue={coupon?.code}
              placeholder="e.g. WELCOME10"
              required
              className="tw-uppercase"
            />
            {state?.error && typeof state.error !== 'string' && state.error.code && (
              <p className="tw-text-sm tw-text-red-500">{state.error.code.join(', ')}</p>
            )}
          </div>

          <div className="tw-space-y-2">
            <Label htmlFor="isActive">Status</Label>
            <div className="tw-flex tw-items-center tw-space-x-2 tw-mt-2">
              <Checkbox id="isActive" name="isActive" defaultChecked={coupon?.isActive ?? true} />
              <label htmlFor="isActive" className="tw-text-sm tw-font-medium tw-leading-none tw-peer-disabled:tw-cursor-not-allowed tw-peer-disabled:tw-opacity-70">
                Active
              </label>
            </div>
          </div>
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            defaultValue={coupon?.description || ''}
            placeholder="e.g. 10% off for new users"
          />
        </div>

        <div className="tw-grid tw-grid-cols-2 tw-gap-6">
          <div className="tw-space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <Select name="discountType" defaultValue={coupon?.discountType || "PERCENTAGE"}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="tw-space-y-2">
            <Label htmlFor="discountValue">Discount Value</Label>
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              step="0.01"
              defaultValue={coupon?.discountValue}
              required
            />
            {state?.error && typeof state.error !== 'string' && state.error.discountValue && (
              <p className="tw-text-sm tw-text-red-500">{state.error.discountValue.join(', ')}</p>
            )}
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-2 tw-gap-6">
          <div className="tw-space-y-2">
            <Label htmlFor="minOrderValue">Min Order Value (₹)</Label>
            <Input
              id="minOrderValue"
              name="minOrderValue"
              type="number"
              step="0.01"
              defaultValue={coupon?.minOrderValue || ''}
              placeholder="Optional"
            />
          </div>

          <div className="tw-space-y-2">
            <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
            <Input
              id="maxDiscount"
              name="maxDiscount"
              type="number"
              step="0.01"
              defaultValue={coupon?.maxDiscount || ''}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-2 tw-gap-6">
          <div className="tw-space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              defaultValue={coupon?.startDate ? new Date(coupon.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className="tw-space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              defaultValue={coupon?.endDate ? new Date(coupon.endDate).toISOString().slice(0, 16) : ''}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-2 tw-gap-6">
          <div className="tw-space-y-2">
            <Label htmlFor="usageLimit">Total Usage Limit</Label>
            <Input
              id="usageLimit"
              name="usageLimit"
              type="number"
              defaultValue={coupon?.usageLimit || ''}
              placeholder="Optional"
            />
          </div>

          <div className="tw-space-y-2">
            <Label htmlFor="perUserLimit">Usage Limit Per User</Label>
            <Input
              id="perUserLimit"
              name="perUserLimit"
              type="number"
              defaultValue={coupon?.perUserLimit || ''}
              placeholder="Optional"
            />
          </div>
        </div>

      </div>

      <div className="tw-flex tw-justify-end tw-gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin" />}
          {coupon ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </div>
      
      {state?.error && typeof state.error === 'string' && (
        <div className="tw-p-4 tw-bg-red-50 tw-text-red-600 tw-rounded-lg">
          {state.error}
        </div>
      )}
    </form>
  )
}
