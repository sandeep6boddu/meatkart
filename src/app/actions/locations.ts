'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth-helpers'

const locationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required"),
    isActive: z.boolean().default(true),
})

export async function createLocation(data: z.infer<typeof locationSchema>) {
    await requireAdmin()

    const validation = locationSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, error: (validation.error as any).errors[0].message }
    }

    try {
        const location = await prisma.location.create({
            data: validation.data
        })
        revalidatePath('/admin/locations')
        return { success: true, location }
    } catch (error) {
        console.error('Create location error:', error)
        return { success: false, error: 'Failed to create location' }
    }
}

export async function updateLocation(id: string, data: z.infer<typeof locationSchema>) {
    await requireAdmin()

    const validation = locationSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, error: (validation.error as any).errors[0].message }
    }

    try {
        const location = await prisma.location.update({
            where: { id },
            data: validation.data
        })
        revalidatePath('/admin/locations')
        return { success: true, location }
    } catch (error) {
        console.error('Update location error:', error)
        return { success: false, error: 'Failed to update location' }
    }
}

export async function deleteLocation(id: string) {
    await requireAdmin()

    try {
        await prisma.location.delete({
            where: { id }
        })
        revalidatePath('/admin/locations')
        return { success: true }
    } catch (error) {
        console.error('Delete location error:', error)
        return { success: false, error: 'Failed to delete location' }
    }
}

export async function getLocations() {
    try {
        const locations = await prisma.location.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                city: true
            },
            orderBy: { name: 'asc' }
        })
        return { success: true, locations }
    } catch (error) {
        console.error('Get locations error:', error)
        return { success: false, error: 'Failed to fetch locations', locations: [] }
    }
}
