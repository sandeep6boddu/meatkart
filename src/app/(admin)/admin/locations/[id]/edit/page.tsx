import { LocationForm } from '@/components/admin/locations/LocationForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'; // sync fix

export default async function EditLocationPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const location = await prisma.location.findUnique({
        where: { id }
    })

    if (!location) {
        notFound()
    }

    return (
        <div className="tw-space-y-6">
            <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Edit Location</h1>
            <LocationForm initialData={location} />
        </div>
    )
}
