'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth-helpers'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser || !authUser.email) {
    return { error: 'Unauthorized' }
  }

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
  }

  const validation = profileSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors }
  }

  try {
    // Check if phone is already taken by ANOTHER user
    const existingPhoneUser = await prisma.user.findUnique({
      where: { phone: data.phone }
    })

    if (existingPhoneUser && existingPhoneUser.email !== authUser.email) {
      return { error: 'Phone number already in use by another account' }
    }

    // Upsert User: Create if not exists, Update if exists
    // We find by email (from authUser) since email is verified
    const user = await prisma.user.findFirst({
      where: { email: authUser.email }
    })

    if (user) {
      // Update existing
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          phone: data.phone
        }
      })
    } else {
      // Create new
      await prisma.user.create({
        data: {
          email: authUser.email,
          name: data.name,
          phone: data.phone,
          role: 'customer'
        }
      })
    }

    revalidatePath('/account/profile')
    return { success: 'Profile updated successfully' }
  } catch (error) {
    console.error('Profile update error:', error)
    return { error: 'Failed to update profile. Please try again.' }
  }
}

export async function addAddress(formData: FormData) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return { error: 'Unauthorized' }

  const user = await prisma.user.findFirst({
    where: { email: authUser.email }
  })

  if (!user) return { error: 'User not found' }

  const data = {
    type: formData.get('type') as string,
    street: formData.get('street') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    pincode: formData.get('pincode') as string,
    landmark: formData.get('landmark') as string,
    isDefault: formData.get('isDefault') === 'on'
  }

  try {
    if (data.isDefault) {
      // Unset other defaults
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      })
    }

    await prisma.address.create({
      data: {
        ...data,
        userId: user.id
      }
    })
    revalidatePath('/account/addresses')
    return { success: 'Address added successfully' }
  } catch (error) {
    console.error('Add address error:', error)
    return { error: 'Failed to add address' }
  }
}

export async function deleteAddress(addressId: string) {
  // SECURITY FIX P1-2: Get current user and verify ownership
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: 'Unauthorized: Please log in' }
  }

  try {
    // SECURITY FIX: Verify address belongs to the authenticated user before deleting
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: currentUser.id  // Only find if it belongs to current user
      }
    })

    if (!address) {
      return { error: 'Address not found or access denied' }
    }

    await prisma.address.delete({
      where: { id: addressId }
    })
    revalidatePath('/account/addresses')
    return { success: 'Address deleted successfully' }
  } catch (error) {
    console.error('Delete address error:', error)
    return { error: 'Failed to delete address' }
  }
}

export async function updateAddress(addressId: string, formData: FormData) {
  // SECURITY FIX: Get current user and verify ownership
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: 'Unauthorized: Please log in' }
  }

  // Verify address belongs to the authenticated user
  const existingAddress = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId: currentUser.id
    }
  })

  if (!existingAddress) {
    return { error: 'Address not found or access denied' }
  }

  const data = {
    type: formData.get('type') as string,
    street: formData.get('street') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    pincode: formData.get('pincode') as string,
    landmark: formData.get('landmark') as string,
    isDefault: formData.get('isDefault') === 'on'
  }

  try {
    if (data.isDefault) {
      // Unset other defaults
      await prisma.address.updateMany({
        where: { userId: currentUser.id },
        data: { isDefault: false }
      })
    }

    await prisma.address.update({
      where: { id: addressId },
      data
    })
    revalidatePath('/account/addresses')
    return { success: 'Address updated successfully' }
  } catch (error) {
    console.error('Update address error:', error)
    return { error: 'Failed to update address' }
  }
}
