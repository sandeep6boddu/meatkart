'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged out successfully')
      router.push('/auth/login')
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-w-full tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-red-600 tw-rounded-lg tw-transition-colors"
    >
      <LogOut size={20} />
      <span className="tw-font-medium">Logout</span>
    </button>
  )
}
