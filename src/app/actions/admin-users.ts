'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireSuperAdmin } from '@/lib/auth-helpers'
import { createAdminClient } from "@/lib/supabase/admin"


const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    role: z.enum(["customer", "admin", "manager", "editor", "super_admin"]),
})

export async function createUser(prevState: any, formData: FormData) {
    // SECURITY FIX P0-2: Verify super admin authorization before proceeding
    try {
        await requireSuperAdmin()
    } catch {
        return { message: 'Unauthorized: Super Admin access required', success: false }
    }

    try {
        const rawData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            role: formData.get('role'),
            password: formData.get('password')
        }

        const validatedData = userSchema.parse({ ...rawData, role: rawData.role || 'customer' })

        // Check if phone already exists
        const existingUser = await prisma.user.findUnique({
            where: { phone: validatedData.phone }
        })

        if (existingUser) {
            return { message: 'User with this phone number already exists', success: false }
        }

        // Check if email already exists (if provided)
        if (validatedData.email) {
            const existingEmail = await prisma.user.findFirst({
                where: { email: validatedData.email }
            });
            if (existingEmail) {
                return { message: 'User with this email already exists', success: false }
            }
        }

        let userId = null

        // If password is provided, create user in Supabase Auth
        if (rawData.password && validatedData.email) {
            const supabaseAdmin = createAdminClient()
            const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: validatedData.email,
                password: rawData.password as string,
                email_confirm: true,
                user_metadata: {
                    name: validatedData.name,
                    phone: validatedData.phone,
                    role: validatedData.role
                }
            })

            if (authError) {
                console.error('Supabase Auth Error:', authError)
                return { message: 'Failed to create auth user: ' + authError.message, success: false }
            }
            // Supabase creates the user ID, we should try to match it or let Prisma generate one if we are just syncing?
            // Usually we want the IDs to match if possible, but schema defines ID as random UUID.
            // If the schema `id` is NOT a foreign key to `auth.users`, then it doesn't matter.
            // Given the schema `id String @id @default(dbgenerated("gen_random_uuid()"))`, these are separate IDs.
            // However, typical Supabase setup links them. 
            // BUT looking at `schema.prisma` provided earlier: `id` is just a UUID.
            // The `auth-helpers` show a lookup by email/phone.
            // So we just create the record in our DB.
        }

        await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email || null,
                phone: validatedData.phone,
                role: validatedData.role,
            },
        })

        revalidatePath('/admin/users')
        return { message: 'User created successfully', success: true }
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            return { message: (e as any).errors[0]?.message || 'Validation error', success: false }
        }
        return { message: 'Failed to create user: ' + e.message, success: false }
    }
}

const updateUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    role: z.enum(["customer", "admin", "manager", "editor", "super_admin"]),
})

export async function updateUserDetails(userId: string, formData: FormData) {
    try {
        await requireSuperAdmin()
    } catch {
        return { message: 'Unauthorized: Super Admin access required', success: false }
    }

    try {
        const rawData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            role: formData.get('role'),
        }

        const validatedData = updateUserSchema.parse(rawData)

        // Check uniqueness for phone/email if changed
        const currentUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!currentUser) return { message: 'User not found', success: false }

        if (validatedData.phone !== currentUser.phone) {
            const existingPhone = await prisma.user.findUnique({ where: { phone: validatedData.phone } })
            if (existingPhone) return { message: 'Phone number already in use', success: false }
        }

        if (validatedData.email && validatedData.email !== currentUser.email) {
            const existingEmail = await prisma.user.findFirst({ where: { email: validatedData.email } })
            if (existingEmail) return { message: 'Email already in use', success: false }
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                name: validatedData.name,
                email: validatedData.email || null,
                phone: validatedData.phone,
                role: validatedData.role,
            }
        })

        revalidatePath('/admin/users')
        return { message: 'User updated successfully', success: true }
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            return { message: (e as any).errors[0]?.message || 'Validation error', success: false }
        }
        return { message: 'Failed to update user: ' + e.message, success: false }
    }
}


export async function updateUserRole(userId: string, newRole: string) {
    // SECURITY FIX P0-2: Verify super admin authorization before proceeding
    try {
        await requireSuperAdmin()
    } catch {
        return { message: 'Unauthorized: Super Admin access required', success: false }
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole as any }
        })
        revalidatePath('/admin/users')
        return { message: 'User role updated successfully', success: true }
    } catch (e: any) {
        return { message: 'Failed to update role: ' + e.message, success: false }
    }
}

export async function deleteUser(userId: string) {
    // SECURITY FIX P0-2: Verify super admin authorization before proceeding
    try {
        await requireSuperAdmin()
    } catch {
        return { message: 'Unauthorized: Super Admin access required', success: false }
    }

    try {
        await prisma.user.delete({
            where: { id: userId }
        })
        revalidatePath('/admin/users')
        return { message: 'User deleted successfully', success: true }
    } catch (e: any) {
        return { message: 'Failed to delete user: ' + e.message, success: false }
    }
}
