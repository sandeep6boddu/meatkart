'use client'

import { useState } from 'react'
import { validateCoupon } from '@/app/actions/coupon'
import { Loader2, Tag } from 'lucide-react'
import { toast } from 'sonner'

interface CouponInputProps {
  cartTotal: number
  onApply: (couponCode: string, discountAmount: number) => void
  onRemove: () => void
  appliedCoupon: string | null
}

export function CouponInput({ cartTotal, onApply, onRemove, appliedCoupon }: CouponInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return

    setLoading(true)
    try {
      // We pass undefined for userId since we might be a guest
      // In a real app, we'd want to check if the user is logged in
      const result = await validateCoupon(code, cartTotal)
      
      if (result.valid && result.discount) {
        onApply(code, result.discount)
        toast.success('Coupon applied successfully!')
      } else {
        toast.error(result.message || 'Invalid coupon')
        onRemove()
      }
    } catch (error) {
      toast.error('Failed to validate coupon')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setCode('')
    onRemove()
    toast.info('Coupon removed')
  }

  if (appliedCoupon) {
    return (
      <div className="tw-bg-green-50 tw-border tw-border-green-200 tw-rounded-lg tw-p-4 tw-mb-4">
        <div className="tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex tw-items-center tw-space-x-2">
            <Tag className="tw-w-4 tw-h-4 tw-text-green-600" />
            <span className="tw-text-green-700 tw-font-medium">
              Code <b>{appliedCoupon}</b> applied
            </span>
          </div>
          <button
            onClick={handleRemove}
            className="tw-text-sm tw-text-red-500 hover:tw-text-red-700 tw-font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="tw-mb-6">
      <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
        Have a coupon code?
      </label>
      <div className="tw-flex tw-space-x-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-lg tw-px-4 tw-py-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-primary/50"
          disabled={loading}
        />
        <button
          onClick={handleApply}
          disabled={!code || loading}
          className="tw-bg-gray-900 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-gray-800 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center"
        >
          {loading ? <Loader2 className="tw-w-4 tw-h-4 tw-animate-spin" /> : 'Apply'}
        </button>
      </div>
    </div>
  )
}
