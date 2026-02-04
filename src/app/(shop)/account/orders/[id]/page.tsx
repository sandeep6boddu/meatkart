import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, MapPin, CreditCard, Package, FileText, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) redirect('/auth/login')

  const order = await prisma.order.findFirst({
    where: {
      id,
      user: { email: authUser.email } // Ensure user owns the order
    },
    include: {
      orderItems: {
        include: {
          product: true,
          productWeight: true
        }
      }
    }
  })

  if (!order) notFound()

  const deliveryAddress = order.deliveryAddress as any

  return (
    <div className="account-order-details">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
        <Link href="/account/orders">
          <button className="btn btn-default" style={{ borderRadius: 0, padding: '5px 12px' }}>
            <ArrowLeft size={16} />
          </button>
        </Link>
        <div>
          <h2 style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '24px', margin: 0, textTransform: 'uppercase' }}>
            Order #{order.orderNumber}
          </h2>
          <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
            Placed on {format(new Date(order.createdAt), "PPP")}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <Link href={`/account/orders/${order.id}/invoice`}>
          <button className="btn btn-default" style={{ borderRadius: 0, fontSize: '12px', fontWeight: 'bold' }}>
            <FileText size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> DOWNLOAD INVOICE
          </button>
        </Link>
        <button className="btn btn-danger" style={{ borderRadius: 0, background: '#f25648', borderColor: '#f25648', fontSize: '12px', fontWeight: 'bold' }}>
          <RefreshCw size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> REORDER
        </button>
      </div>

      <div className="row">
        <div className="col-md-8">
          {/* Items Panel */}
          <div style={{ border: '1px solid #eee', background: '#fff', marginBottom: '30px' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #eee', background: '#fcfcfc' }}>
              <h4 style={{ margin: 0, fontFamily: 'noto_sansbold', color: '#666', fontSize: '16px' }}>ITEMS</h4>
            </div>
            <div style={{ padding: '20px' }}>
              {order.orderItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '60px', height: '60px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
                      <Package size={24} color="#ccc" />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#555', fontWeight: 'bold', fontSize: '14px' }}>{item.product.name}</p>
                      <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
                        {item.productWeight.weight} • {item.cutType || 'Standard'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>₹{Number(item.totalPrice).toFixed(2)}</p>
                    <p style={{ margin: 0, color: '#999', fontSize: '11px' }}>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '20px', padding: '15px', background: '#fcfcfc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                  <span style={{ color: '#777' }}>Subtotal</span>
                  <span style={{ color: '#333' }}>₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                  <span style={{ color: '#777' }}>Delivery</span>
                  <span style={{ color: '#333' }}>₹0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee', fontSize: '16px', fontWeight: 'bold' }}>
                  <span style={{ color: '#666' }}>Total</span>
                  <span style={{ color: '#f25648' }}>₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {/* Delivery Panel */}
          <div style={{ border: '1px solid #eee', background: '#fff', marginBottom: '30px' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #eee', background: '#fcfcfc' }}>
              <h4 style={{ margin: 0, fontFamily: 'noto_sansbold', color: '#666', fontSize: '16px' }}>DELIVERY DETAILS</h4>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                <MapPin size={18} color="#ccc" style={{ marginTop: '2px' }} />
                <div style={{ fontSize: '13px', color: '#666' }}>
                  <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{deliveryAddress?.name}</p>
                  <p style={{ margin: '0 0 2px 0' }}>{deliveryAddress?.street}</p>
                  <p style={{ margin: '0 0 10px 0' }}>{deliveryAddress?.city}, {deliveryAddress?.pincode}</p>
                  <p style={{ margin: 0, color: '#999' }}>{deliveryAddress?.phone}</p>
                </div>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f5f5f5' }}>
                <p style={{ fontSize: '11px', color: '#999', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Status</p>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  textTransform: 'uppercase',
                  background: order.status === 'delivered' ? '#dff0d8' : '#fcf8e3',
                  color: order.status === 'delivered' ? '#3c763d' : '#8a6d3b'
                }}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Panel */}
          <div style={{ border: '1px solid #eee', background: '#fff' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #eee', background: '#fcfcfc' }}>
              <h4 style={{ margin: 0, fontFamily: 'noto_sansbold', color: '#666', fontSize: '16px' }}>PAYMENT</h4>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#666' }}>
                <CreditCard size={18} color="#ccc" />
                <span style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '1px 6px',
                  border: '1px solid',
                  textTransform: 'uppercase',
                  borderColor: order.paymentStatus === 'paid' ? '#5cb85c' : '#ccc',
                  color: order.paymentStatus === 'paid' ? '#5cb85c' : '#999'
                }}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
