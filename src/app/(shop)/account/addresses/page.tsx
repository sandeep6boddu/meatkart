import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { MapPin } from 'lucide-react'
import { AddAddressDialog } from '@/components/account/AddAddressDialog'
import { AddressCard } from '@/components/account/AddressCard'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      addresses: {
        orderBy: { isDefault: 'desc' }
      }
    }
  })

  const addresses = user?.addresses || []

  return (
    <div className="account-addresses">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '24px', margin: 0, textTransform: 'uppercase' }}>
          My Addresses
        </h2>
        <AddAddressDialog />
      </div>

      <div className="row">
        {addresses.length === 0 ? (
          <div className="col-md-12">
            <div className="text-center" style={{ border: '2px dashed #eee', padding: '50px 0', background: '#fff' }}>
              <MapPin size={48} color="#ccc" style={{ marginBottom: '15px' }} />
              <h3 style={{ color: '#666', fontFamily: 'noto_sansbold', fontSize: '18px' }}>No addresses found</h3>
              <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>Add a shipping address to speed up checkout.</p>
              <AddAddressDialog />
            </div>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="col-md-6" style={{ marginBottom: '30px' }}>
              <AddressCard address={address} userName={user?.name || ''} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
