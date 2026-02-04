'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth-helpers'

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().uuid(),
  description: z.string().optional(),
  freshnessNotes: z.string().optional(),
  cutTypes: z.string().optional(),
  freshnessDate: z.string().optional(),
  stockQuantity: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true),
  isBestSeller: z.boolean().default(false),
  images: z.array(z.object({
    imageUrl: z.string().url(),
    isPrimary: z.boolean().default(false),
  })),
  weights: z.array(z.object({
    id: z.string().optional(),
    weight: z.string().min(1),
    price: z.coerce.number().min(0),
    discountPrice: z.coerce.number().min(0).optional(),
    isActive: z.boolean().default(true),
  })).min(1, 'At least one weight option is required'),
  locationIds: z.array(z.string()).optional()
})

export type ProductFormState = {
  errors?: {
    [key: string]: string[]
  }
  message?: string
  inputs?: any
}

export async function createProduct(prevState: ProductFormState, formData: FormData) {
  // SECURITY FIX P0-2: Verify admin authorization before proceeding
  try {
    await requireAdmin()
  } catch {
    return { message: 'Unauthorized: Admin access required' }
  }

  // Parse complex data from JSON strings in hidden fields
  const images = JSON.parse(formData.get('images') as string || '[]')
  const weights = JSON.parse(formData.get('weights') as string || '[]')
  const locationIds = JSON.parse(formData.get('locationIds') as string || '[]')

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    categoryId: formData.get('categoryId'),
    description: formData.get('description'),
    freshnessNotes: formData.get('freshnessNotes'),
    cutTypes: formData.get('cutTypes'),
    freshnessDate: formData.get('freshnessDate'),
    stockQuantity: formData.get('stockQuantity'),
    isActive: formData.get('isActive') === 'on',
    isBestSeller: formData.get('isBestSeller') === 'on',
    images,
    weights,
    locationIds,
  }

  const validatedFields = productSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
      inputs: rawData
    }
  }

  const { data } = validatedFields

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        description: data.description,
        freshnessNotes: data.freshnessNotes,
        cutTypes: data.cutTypes,
        freshnessDate: data.freshnessDate ? new Date(data.freshnessDate) : null,
        stockQuantity: data.stockQuantity,
        isActive: data.isActive,
        isBestSeller: data.isBestSeller,
        productImages: {
          create: data.images.map((img, idx) => ({
            imageUrl: img.imageUrl,
            isPrimary: idx === 0, // Default first to primary if not specified
            displayOrder: idx
          }))
        },
        productWeights: {
          create: data.weights.map(w => ({
            weight: w.weight,
            price: w.price,
            discountPrice: w.discountPrice,
            isActive: w.isActive
          }))
        },
        locations: {
          connect: data.locationIds ? data.locationIds.map(id => ({ id })) : []
        }
      },
    })
  } catch (error: any) {
    console.error('Database Error:', error)
    return {
      message: `Database Error: ${error.message || 'Failed to Create Product'}`,
      inputs: rawData
    }
  }

  revalidatePath('/admin/products')
  redirect('/admin/products?success=created')
}

export async function updateProduct(
  id: string,
  prevState: ProductFormState,
  formData: FormData
) {
  // SECURITY FIX P0-2: Verify admin authorization before proceeding
  try {
    await requireAdmin()
  } catch {
    return { message: 'Unauthorized: Admin access required' }
  }

  const images = JSON.parse(formData.get('images') as string || '[]')
  const weights = JSON.parse(formData.get('weights') as string || '[]')
  const locationIds = JSON.parse(formData.get('locationIds') as string || '[]')

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    categoryId: formData.get('categoryId'),
    description: formData.get('description'),
    freshnessNotes: formData.get('freshnessNotes'),
    cutTypes: formData.get('cutTypes'),
    freshnessDate: formData.get('freshnessDate'),
    stockQuantity: formData.get('stockQuantity'),
    isActive: formData.get('isActive') === 'on',
    isBestSeller: formData.get('isBestSeller') === 'on',
    images,
    weights,
    locationIds,
  }

  const validatedFields = productSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
      inputs: rawData
    }
  }

  const { data } = validatedFields

  try {
    // Transaction to handle updates
    await prisma.$transaction(async (tx) => {
      // Update basic fields
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          categoryId: data.categoryId,
          description: data.description,
          freshnessNotes: data.freshnessNotes,
          cutTypes: data.cutTypes,
          freshnessDate: data.freshnessDate ? new Date(data.freshnessDate) : null,
          stockQuantity: data.stockQuantity,
          isActive: data.isActive,
          isBestSeller: data.isBestSeller,
        },
      })

      // Handle Images: Delete all and recreate (simplest approach for now)
      await tx.productImage.deleteMany({ where: { productId: id } })
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img, idx) => ({
            productId: id,
            imageUrl: img.imageUrl,
            isPrimary: idx === 0,
            displayOrder: idx
          }))
        })
      }

      // Handle Weights - delete and recreate
      await tx.productWeight.deleteMany({ where: { productId: id } })
      if (data.weights.length > 0) {
        await tx.productWeight.createMany({
          data: data.weights.map(w => ({
            productId: id,
            weight: w.weight,
            price: w.price,
            discountPrice: w.discountPrice,
            isActive: w.isActive
          }))
        })
      }

      // Handle Locations
      if (data.locationIds) {
        await tx.product.update({
          where: { id },
          data: {
            locations: {
              set: data.locationIds.map(id => ({ id }))
            }
          }
        })
      }
    })
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Database Error: Failed to Update Product.',
    }
  }

  revalidatePath('/admin/products')
  redirect('/admin/products?success=updated')
}

export async function deleteProduct(id: string) {
  // SECURITY FIX P0-2: Verify admin authorization before proceeding
  try {
    await requireAdmin()
  } catch {
    return { success: false, message: 'Unauthorized: Admin access required' }
  }

  try {
    await prisma.product.delete({
      where: { id },
    })
    revalidatePath('/admin/products')
    return { success: true, message: 'Product deleted successfully' }
  } catch (error) {
    console.error('Database Error:', error)
    return { success: false, message: 'Failed to delete product' }
  }
}
