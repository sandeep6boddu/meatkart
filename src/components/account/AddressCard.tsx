'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Pencil } from 'lucide-react'
import { deleteAddress } from '@/app/actions/user'
import { toast } from 'sonner'
import { useTransition } from 'react'

interface AddressCardProps {
  address: any // Type this properly if possible
  userName: string
}

export function AddressCard({ address, userName }: AddressCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this address?')) {
      startTransition(async () => {
        const result = await deleteAddress(address.id)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('Address deleted')
        }
      })
    }
  }

  return (
    <div style={{ border: '1px solid #eee', position: 'relative', background: '#fff' }}>
      <div style={{ padding: '20px' }}>
        {address.isDefault && (
          <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#5cb85c', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', textTransform: 'uppercase' }}>
            DEFAULT
          </span>
        )}
        {address.type && (
          <span style={{ display: 'inline-block', background: '#f5f5f5', color: '#777', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', textTransform: 'uppercase', marginBottom: '10px' }}>
            {address.type}
          </span>
        )}
        <div style={{ marginTop: '5px' }}>
          <p style={{ fontFamily: 'noto_sansbold', color: '#555', fontSize: '16px', margin: '0 0 5px 0' }}>{userName}</p>
          <p style={{ color: '#777', fontSize: '14px', margin: '0 0 5px 0' }}>{address.street}</p>
          <p style={{ color: '#777', fontSize: '14px', margin: '0 0 10px 0' }}>{address.city}, {address.state} - {address.pincode}</p>
          {address.landmark && (
            <p style={{ color: '#999', fontSize: '12px', fontStyle: 'italic', margin: 0 }}>Landmark: {address.landmark}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid #f5f5f5', paddingTop: '15px' }}>
          <button
            className="btn btn-default"
            style={{ borderRadius: 0, flex: 1, fontSize: '12px', fontWeight: 'bold', fontFamily: 'noto_sansbold' }}
          >
            EDIT
          </button>
          <button
            className="btn btn-default"
            style={{ borderRadius: 0, color: '#d9534f', fontSize: '12px' }}
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
