'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateSettings } from "@/app/actions/settings";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface SettingsFormProps {
    initialSettings: Record<string, any[]>;
}

const DEFAULT_SETTINGS = {
    payment: [
        { key: 'RAZORPAY_KEY_ID', label: 'Razorpay Key ID', placeholder: 'rzp_test_...' },
        { key: 'RAZORPAY_KEY_SECRET', label: 'Razorpay Key Secret', placeholder: '...' },
    ],
    shipping: [
        { key: 'SHIPROCKET_EMAIL', label: 'Shiprocket Email', placeholder: 'email@example.com' },
        { key: 'SHIPROCKET_PASSWORD', label: 'Shiprocket Password', placeholder: '...' },
    ],
    notifications: [
        { key: 'SMS_PROVIDER_KEY', label: 'SMS Provider Key', placeholder: '...' },
    ]
};

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [loading, setLoading] = useState(false);
    // Merge existing values with defaults to ensure fields show up even if not in DB yet
    const [values, setValues] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};

        // Populate from DB
        Object.values(initialSettings).flat().forEach(s => {
            initial[s.key] = s.value;
        });

        // Ensure defaults exist
        Object.values(DEFAULT_SETTINGS).flat().forEach(s => {
            if (initial[s.key] === undefined) initial[s.key] = '';
        });

        return initial;
    });

    const handleChange = (key: string, value: string) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (group: string) => {
        setLoading(true);
        try {
            const settingsToSave = (DEFAULT_SETTINGS as any)[group].map((setting: any) => ({
                key: setting.key,
                value: values[setting.key],
                group
            }));

            const result = await updateSettings(settingsToSave);
            if (result.success) {
                toast.success('Settings saved successfully');
            } else {
                toast.error(result.message);
            }
        } catch (e) {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tabs defaultValue="payment" className="tw-w-full">
            <TabsList className="tw-grid tw-w-full tw-grid-cols-3">
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {Object.entries(DEFAULT_SETTINGS).map(([group, fields]) => (
                <TabsContent key={group} value={group} className="tw-space-y-4 tw-mt-6">
                    <div className="tw-grid tw-gap-4">
                        {fields.map((field) => (
                            <div key={field.key} className="tw-grid tw-gap-2">
                                <Label htmlFor={field.key}>{field.label}</Label>
                                <Input
                                    id={field.key}
                                    value={values[field.key] || ''}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    type={field.key.includes('PASSWORD') || field.key.includes('SECRET') ? 'password' : 'text'}
                                />
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => handleSave(group)} disabled={loading} className="tw-mt-4">
                        {loading && <Loader2 className="tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin" />}
                        <Save className="tw-mr-2 tw-h-4 tw-w-4" />
                        Save {group.charAt(0).toUpperCase() + group.slice(1)} Settings
                    </Button>
                </TabsContent>
            ))}
        </Tabs>
    );
}
