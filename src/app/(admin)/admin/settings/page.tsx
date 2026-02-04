import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    await requireSuperAdmin();

    const settings = await prisma.systemSetting.findMany({
        orderBy: { key: 'asc' }
    });

    // Group settings by their group field
    const groupedSettings = settings.reduce((acc: Record<string, typeof settings>, setting: any) => {
        const group = setting.group || 'general';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(setting);
        return acc;
    }, {});

    return (
        <div className="tw-space-y-6">
            <div className="tw-flex tw-items-center tw-justify-between">
                <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">System Settings</h1>
            </div>

            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-p-6">
                <SettingsForm initialSettings={groupedSettings} />
            </div>
        </div>
    );
}
