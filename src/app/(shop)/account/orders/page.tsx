import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { orderItems: true } }
        }
      }
    }
  })

  const orders = user?.orders || []

  return (
    <div className="account-orders">
      <h2 style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '24px', margin: '0 0 25px 0', textTransform: 'uppercase' }}>
        My Orders
      </h2>

      <div style={{ border: '1px solid #eee', background: '#fff' }}>
        <div className="table-responsive">
          <table className="table table-hover" style={{ margin: 0 }}>
            <thead style={{ background: '#fcfcfc', borderBottom: '1px solid #eee' }}>
              <tr>
                <th style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '13px', padding: '15px' }}>ORDER #</th>
                <th style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '13px', padding: '15px' }}>DATE</th>
                <th style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '13px', padding: '15px' }}>STATUS</th>
                <th style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '13px', padding: '15px' }}>TOTAL</th>
                <th style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '13px', padding: '15px' }} className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center" style={{ padding: '40px', color: '#999' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>
                      {order.orderNumber}
                    </td>
                    <td style={{ padding: '15px', color: '#777', fontSize: '13px' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        textTransform: 'uppercase',
                        background: order.status === 'delivered' ? '#dff0d8' : order.status === 'cancelled' ? '#f2dede' : '#fcf8e3',
                        color: order.status === 'delivered' ? '#3c763d' : order.status === 'cancelled' ? '#a94442' : '#8a6d3b'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#333', fontWeight: 'bold' }}>
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td style={{ padding: '15px' }} className="text-right">
                      <Link href={`/account/orders/${order.id}`} style={{ color: '#f25648', fontSize: '12px', fontWeight: 'bold' }}>
                        VIEW DETAILS
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
