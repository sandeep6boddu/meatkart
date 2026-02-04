'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteLocation } from '@/app/actions/locations'

export function DeleteLocationButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this location?')) return

        setLoading(true)
        try {
            const res = await deleteLocation(id)
            if (res.success) {
                toast.success('Location deleted successfully')
                router.refresh()
            } else {
                toast.error(res.error || 'Failed to delete location')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="tw-h-8 tw-w-8 tw-text-red-600 hover:tw-text-red-700 hover:tw-bg-red-50"
            onClick={handleDelete}
            disabled={loading}
        >
            <Trash2 size={16} />
        </Button>
    )
}
