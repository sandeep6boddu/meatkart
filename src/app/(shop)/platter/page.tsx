import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getPlatters } from '@/app/actions/platter'
import PlatterClient from './PlatterClient'

export default async function PlatterPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login?next=/platter')
    }

    const platters = await getPlatters()

    return (
        <div className="tw-min-h-screen tw-bg-gray-50 tw-pt-10 tw-pb-20">
            <div className="tw-max-w-[1180px] tw-mx-auto tw-px-4">
                <h1 className="tw-text-3xl tw-font-bold tw-text-teal tw-mb-8">My Platter</h1>
                <PlatterClient initialPlatters={platters} userId={user.id} />
            </div>
        </div>
    )
}
