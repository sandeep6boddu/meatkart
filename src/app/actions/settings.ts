'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireSuperAdmin } from "@/lib/auth-helpers"
import { z } from "zod" // Import zod, though we might just use string for value for now

export type SystemSettingGroup = 'general' | 'payment' | 'shipping' | 'notifications';

export async function getSettings(group?: SystemSettingGroup) {
    try {
        await requireSuperAdmin()

        const where = group ? { group } : undefined;

        const settings = await prisma.systemSetting.findMany({
            where,
            orderBy: { key: 'asc' }
        });

        return { settings, success: true };
    } catch (e: any) {
        return { message: 'Failed to fetch settings', success: false };
    }
}

export async function updateSetting(key: string, value: string) {
    try {
        await requireSuperAdmin()

        await prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: {
                key,
                value,
                group: 'general' // Default group, usually should be passed or pre-seeded
            }
        });

        revalidatePath('/admin/settings');
        return { message: 'Setting updated successfully', success: true };
    } catch (e: any) {
        return { message: 'Failed to update setting: ' + e.message, success: false };
    }
}

export async function updateSettings(settings: { key: string, value: string, group?: string }[]) {
    try {
        await requireSuperAdmin()

        for (const setting of settings) {
            await prisma.systemSetting.upsert({
                where: { key: setting.key },
                update: {
                    value: setting.value,
                    ...(setting.group ? { group: setting.group } : {})
                },
                create: {
                    key: setting.key,
                    value: setting.value,
                    group: setting.group || 'general'
                }
            });
        }

        revalidatePath('/admin/settings');
        return { message: 'Settings updated successfully', success: true };
    } catch (e: any) {
        return { message: 'Failed to update settings: ' + e.message, success: false };
    }
}
