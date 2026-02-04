'use client'

import { clearAppCache } from '@/app/actions/admin'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function CacheClearButton() {
    const [loading, setLoading] = useState(false)

    const handleClearCache = async () => {
        setLoading(true)
        try {
            const res = await clearAppCache()
            if (res.success) {
                toast.success('App cache cleared successfully')
            } else {
                toast.error(res.error || 'Failed to clear cache')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleClearCache}
            disabled={loading}
            className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-w-full tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-colors disabled:tw-opacity-50"
        >
            <RefreshCw size={20} className={loading ? "tw-animate-spin" : ""} />
            <span className="tw-font-medium">Clear Cache</span>
        </button>
    )
}
