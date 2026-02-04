import { LocationForm } from '@/components/admin/locations/LocationForm'

export default function NewLocationPage() {
    return (
        <div className="tw-space-y-6">
            <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Add New Location</h1>
            <LocationForm />
        </div>
    )
}
