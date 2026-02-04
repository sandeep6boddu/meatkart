import Link from "next/link";
import { Plus, Pencil, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DeleteLocationButton } from "@/components/admin/locations/DeleteLocationButton";

export const dynamic = 'force-dynamic';

export default async function LocationsPage() {
    const locations = await prisma.location.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    return (
        <div className="tw-space-y-6">
            <div className="tw-flex tw-items-center tw-justify-between">
                <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Locations</h1>
                <Link href="/admin/locations/new">
                    <Button className="tw-flex tw-items-center tw-gap-2">
                        <Plus size={16} />
                        Add Location
                    </Button>
                </Link>
            </div>

            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-overflow-hidden">
                <div className="tw-overflow-x-auto">
                    <table className="tw-w-full tw-text-left tw-text-sm">
                        <thead className="tw-bg-gray-50 tw-border-b">
                            <tr>
                                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Name</th>
                                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">City</th>
                                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Pincode</th>
                                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Status</th>
                                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Products</th>
                                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500 tw-text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="tw-divide-y">
                            {locations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="tw-px-6 tw-py-8 tw-text-center tw-text-gray-500">
                                        No locations found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                locations.map((location) => (
                                    <tr key={location.id} className="hover:tw-bg-gray-50 tw-transition-colors">
                                        <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                                            <div className="tw-flex tw-items-center tw-gap-2">
                                                <MapPin size={16} className="tw-text-gray-400" />
                                                {location.name}
                                            </div>
                                        </td>
                                        <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                                            {location.city}, {location.state}
                                        </td>
                                        <td className="tw-px-6 tw-py-4 tw-text-gray-600 tw-font-mono tw-text-xs">
                                            {location.pincode}
                                        </td>
                                        <td className="tw-px-6 tw-py-4">
                                            <span
                                                className={`tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium ${location.isActive
                                                        ? "tw-bg-green-100 tw-text-green-800"
                                                        : "tw-bg-red-100 tw-text-red-800"
                                                    }`}
                                            >
                                                {location.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                                            <span className="tw-px-2.5 tw-py-0.5 tw-rounded-full tw-bg-blue-50 tw-text-blue-700 tw-text-xs tw-font-medium">
                                                {location._count.products} products
                                            </span>
                                        </td>
                                        <td className="tw-px-6 tw-py-4 tw-text-right">
                                            <div className="tw-flex tw-items-center tw-justify-end tw-gap-2">
                                                <Link href={`/admin/locations/${location.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="tw-h-8 tw-w-8 tw-text-blue-600">
                                                        <Pencil size={16} />
                                                    </Button>
                                                </Link>
                                                <DeleteLocationButton id={location.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
