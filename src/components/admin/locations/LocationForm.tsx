'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createLocation, updateLocation } from '@/app/actions/locations'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const locationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required"),
    isActive: z.boolean(),
})

type FormData = z.infer<typeof locationSchema>

interface LocationFormProps {
    initialData?: FormData & { id: string }
}

export function LocationForm({ initialData }: LocationFormProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<FormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: initialData || {
            name: '',
            city: '',
            state: '',
            pincode: '',
            isActive: true,
        }
    })

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        try {
            let res
            if (initialData) {
                res = await updateLocation(initialData.id, data)
            } else {
                res = await createLocation(data)
            }

            if (res.success) {
                toast.success(initialData ? 'Location updated' : 'Location created')
                router.push('/admin/locations')
                router.refresh()
            } else {
                toast.error(res.error || 'Something went wrong')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="tw-bg-white tw-rounded-xl tw-border tw-border-gray-100 tw-p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="tw-space-y-6">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
                    <div className="tw-space-y-2">
                        <Label htmlFor="name">Location Name</Label>
                        <Input id="name" {...form.register('name')} placeholder="e.g. Hyderabad Main" />
                        {form.formState.errors.name && (
                            <p className="tw-text-sm tw-text-red-500">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="tw-space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" {...form.register('pincode')} placeholder="e.g. 500081" />
                        {form.formState.errors.pincode && (
                            <p className="tw-text-sm tw-text-red-500">{form.formState.errors.pincode.message}</p>
                        )}
                    </div>

                    <div className="tw-space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...form.register('city')} />
                        {form.formState.errors.city && (
                            <p className="tw-text-sm tw-text-red-500">{form.formState.errors.city.message}</p>
                        )}
                    </div>

                    <div className="tw-space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" {...form.register('state')} />
                        {form.formState.errors.state && (
                            <p className="tw-text-sm tw-text-red-500">{form.formState.errors.state.message}</p>
                        )}
                    </div>
                </div>

                <div className="tw-flex tw-items-center tw-space-x-2">
                    <input
                        type="checkbox"
                        id="isActive"
                        className="tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-text-primary focus:tw-ring-primary"
                        {...form.register('isActive')}
                    />
                    <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="tw-flex tw-justify-end tw-gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="tw-animate-spin tw-mr-2" size={18} /> : null}
                        {initialData ? 'Update Location' : 'Create Location'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
