'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth-helpers'

export async function clearAppCache() {
    const currentUser = await getCurrentUser()
    // Assuming 'admin' or 'super_admin' check is done here or by caller.
    // For now, let's check basic role
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        console.error('Failed to clear cache:', error)
        return { success: false, error: 'Failed to clear cache' }
    }
}
