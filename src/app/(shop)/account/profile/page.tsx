import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from '@/components/account/ProfileForm'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email }
  })

  // Fallback for new users who haven't set up their profile yet
  const userData = {
    name: user?.name || authUser.user_metadata?.name || '',
    email: user?.email || authUser.email || '',
    phone: user?.phone || ''
  }

  return (
    <div style={{ background: '#fff', padding: '30px' }}>
      <h2 style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '20px', margin: '0 0 20px 0', borderBottom: '1px solid #ececec', paddingBottom: '15px' }}>
        PROFILE & SECURITY
      </h2>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '16px', marginBottom: '15px' }}>Personal Information</h3>
        <div style={{ border: '1px solid #ececec', padding: '20px' }}>
          <ProfileForm user={userData} />
        </div>
      </div>

      <div>
        <h3 style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '16px', marginBottom: '15px' }}>Account Actions</h3>
        <div style={{ border: '1px solid #ececec', padding: '20px' }}>
          <div style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: '15px', marginBottom: '15px' }}>
            <h4 style={{ fontFamily: 'noto_sansbold', fontSize: '14px', color: '#555', margin: '0 0 5px 0' }}>Log out from all devices</h4>
            <p style={{ color: '#999', fontSize: '13px', margin: '0 0 10px 0' }}>Secure your account by logging out from all other sessions.</p>
            <button style={{ background: '#fff', border: '1px solid #ccc', color: '#666', padding: '6px 15px', fontSize: '13px', cursor: 'pointer' }}>
              LOG OUT ALL
            </button>
          </div>
          <div>
            <h4 style={{ fontFamily: 'noto_sansbold', fontSize: '14px', color: '#d9534f', margin: '0 0 5px 0' }}>Delete Account</h4>
            <p style={{ color: '#999', fontSize: '13px', margin: '0 0 10px 0' }}>Permanently remove your account and data.</p>
            <button style={{ background: '#d9534f', border: 'none', color: '#fff', padding: '6px 15px', fontSize: '13px', cursor: 'pointer' }}>
              DELETE ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
