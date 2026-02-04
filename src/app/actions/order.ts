'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth-helpers'

const statusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

export async function updateOrderStatus(orderId: string, formData: FormData) {
  // SECURITY FIX P0-2: Verify admin authorization before proceeding
  try {
    await requireAdmin()
  } catch {
    return { success: false, message: 'Unauthorized: Admin access required' }
  }

  const status = formData.get('status') as string

  const validatedFields = statusSchema.safeParse({ status })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid status',
    }
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
        paymentStatus: status === 'delivered' ? 'paid' : undefined,
        delivery: {
          upsert: {
            create: {
              status: status,
              deliveredAt: status === 'delivered' ? new Date() : null
            },
            update: {
              status: status,
              deliveredAt: status === 'delivered' ? new Date() : null
            }
          }
        }
      },
    })

    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath('/admin/orders')
    return { success: true, message: 'Order status updated successfully' }
  } catch (error) {
    console.error('Database Error:', error)
    return { success: false, message: 'Failed to update order status' }
  }
}
