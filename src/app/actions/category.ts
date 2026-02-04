'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth-helpers'

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  displayOrder: z.coerce.number().int().default(0),
})

export type CategoryFormState = {
  errors?: {
    [key: string]: string[]
  }
  message?: string
}

export async function createCategory(prevState: CategoryFormState, formData: FormData) {
  // SECURITY FIX P0-2: Verify admin authorization before proceeding
  try {
    await requireAdmin()
  } catch {
    return { message: 'Unauthorized: Admin access required' }
  }

  const validatedFields = categorySchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
    displayOrder: formData.get('displayOrder'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Category.',
    }
  }

  const { data } = validatedFields

  try {
    await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl || null,
        displayOrder: data.displayOrder,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Database Error: Failed to Create Category.',
    }
  }

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function updateCategory(
  id: string,
  prevState: CategoryFormState,
  formData: FormData
) {
  // SECURITY FIX P0-2: Verify admin authorization before proceeding
  try {
    await requireAdmin()
  } catch {
    return { message: 'Unauthorized: Admin access required' }
  }

  const validatedFields = categorySchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
    displayOrder: formData.get('displayOrder'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Category.',
    }
  }

  const { data } = validatedFields

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl || null,
        displayOrder: data.displayOrder,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Database Error: Failed to Update Category.',
    }
  }

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
  // SECURITY FIX P0-2: Verify admin authorization before proceeding
  try {
    await requireAdmin()
  } catch {
    return { success: false, message: 'Unauthorized: Admin access required' }
  }

  try {
    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    })

    if (productsCount > 0) {
      return { success: false, message: `Cannot delete category. It has ${productsCount} products.` }
    }

    await prisma.category.delete({
      where: { id },
    })
    revalidatePath('/admin/categories')
    return { success: true, message: 'Category deleted successfully' }
  } catch (error) {
    console.error('Database Error:', error)
    return { success: false, message: 'Failed to delete category' }
  }
}
