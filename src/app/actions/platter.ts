'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth-helpers'

const platterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    userId: z.string().uuid()
})

export async function getPlatters() {
    // SECURITY: Use session user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return []
    }

    try {
        const platters = await prisma.platter.findMany({
            where: { userId: currentUser.id },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                productImages: {
                                    where: { isPrimary: true },
                                    take: 1
                                }
                            }
                        },
                        productWeight: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        })
        return platters
    } catch (error) {
        console.error('Error fetching platters:', error)
        return []
    }
}

export async function createPlatter(name: string) {
    // SECURITY: Use session user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const platter = await prisma.platter.create({
            data: {
                name,
                userId: currentUser.id
            }
        })
        revalidatePath('/platter')
        return { success: true, platter }
    } catch (error) {
        console.error('Error creating platter:', error)
        return { success: false, error: 'Failed to create platter' }
    }
}

export async function addItemToPlatter(
    platterId: string,
    productId: string,
    weightId: string,
    cutType: string | null,
    quantity: number = 1
) {
    // SECURITY: Verify platter belongs to current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return { success: false, error: 'Unauthorized' }
    }

    const platter = await prisma.platter.findFirst({
        where: { id: platterId, userId: currentUser.id }
    })
    if (!platter) {
        return { success: false, error: 'Platter not found or access denied' }
    }

    try {
        // Check if item already exists in platter
        const existingItem = await prisma.platterItem.findFirst({
            where: {
                platterId,
                productId,
                weightId,
                cutType
            }
        })

        if (existingItem) {
            await prisma.platterItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            })
        } else {
            await prisma.platterItem.create({
                data: {
                    platterId,
                    productId,
                    weightId,
                    cutType,
                    quantity
                }
            })
        }

        revalidatePath('/platter')
        return { success: true }
    } catch (error) {
        console.error('Error adding item to platter:', error)
        return { success: false, error: 'Failed to add item to platter' }
    }
}

export async function removeItemFromPlatter(itemId: string) {
    // SECURITY: Verify item belongs to current user's platter
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return { success: false, error: 'Unauthorized' }
    }

    const item = await prisma.platterItem.findFirst({
        where: { id: itemId },
        include: { platter: { select: { userId: true } } }
    })

    if (!item || item.platter.userId !== currentUser.id) {
        return { success: false, error: 'Item not found or access denied' }
    }

    try {
        await prisma.platterItem.delete({
            where: { id: itemId }
        })
        revalidatePath('/platter')
        return { success: true }
    } catch (error) {
        console.error('Error removing item from platter:', error)
        return { success: false, error: 'Failed to remove item' }
    }
}

export async function deletePlatter(platterId: string) {
    // SECURITY: Verify platter belongs to current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return { success: false, error: 'Unauthorized' }
    }

    const platter = await prisma.platter.findFirst({
        where: { id: platterId, userId: currentUser.id }
    })
    if (!platter) {
        return { success: false, error: 'Platter not found or access denied' }
    }

    try {
        await prisma.platter.delete({
            where: { id: platterId }
        })
        revalidatePath('/platter')
        return { success: true }
    } catch (error) {
        console.error('Error deleting platter:', error)
        return { success: false, error: 'Failed to delete platter' }
    }
}

export async function renamePlatter(platterId: string, name: string) {
    // SECURITY: Verify platter belongs to current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return { success: false, error: 'Unauthorized' }
    }

    const platter = await prisma.platter.findFirst({
        where: { id: platterId, userId: currentUser.id }
    })
    if (!platter) {
        return { success: false, error: 'Platter not found or access denied' }
    }

    try {
        await prisma.platter.update({
            where: { id: platterId },
            data: { name }
        })
        revalidatePath('/platter')
        return { success: true }
    } catch (error) {
        console.error('Error renaming platter:', error)
        return { success: false, error: 'Failed to rename platter' }
    }
}
