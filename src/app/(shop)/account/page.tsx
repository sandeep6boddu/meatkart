import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Package, MapPin, User, Heart } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  // Find prisma user by email
  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      orders: {
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { orderItems: true } }
        }
      },
      addresses: {
        where: { isDefault: true },
        take: 1
      },
      wallet: true,
      wishlist: {
        include: {
          _count: {
            select: { items: true }
          }
        }
      }
    }
  })

  const wishlistCount = user?.wishlist?._count?.items || 0
  const displayName = user?.name || authUser?.user_metadata?.name || 'User'
  const displayEmail = user?.email || authUser.email
  const displayPhone = user?.phone || 'Not set'

  return (
    <div className="account-overview">
      {/* Header Info */}
      <div style={{ background: '#f9f9f9', padding: '25px', border: '1px solid #eee', marginBottom: '30px' }}>
        <div className="row">
          <div className="col-md-8">
            <h2 style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '24px', margin: '0 0 15px 0' }}>
              Hello, {displayName}
            </h2>
            <div style={{ color: '#888', fontFamily: 'noto_sansregular', fontSize: '15px' }}>
              <p style={{ margin: '0 0 5px 0' }}><strong>Email:</strong> {displayEmail}</p>
              <p style={{ margin: '0 0 5px 0' }}><strong>Mobile:</strong> {displayPhone}</p>
              <p style={{ margin: '0' }}>
                <span style={{ background: '#dff0d8', color: '#3c763d', padding: '2px 10px', fontSize: '12px', fontWeight: 'bold' }}>ACTIVE</span>
              </p>
            </div>
            {!user && (
              <div className="alert alert-warning" style={{ marginTop: '15px', color: '#8a6d3b', backgroundColor: '#fcf8e3', borderColor: '#faebcc' }}>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  <strong>Note:</strong> Your profile details are incomplete. <Link href="/account/profile" style={{ textDecoration: 'underline' }}>Update Profile</Link>
                </p>
              </div>
            )}
          </div>
          {user?.wallet && (
            <div className="col-md-4 text-right">
              <div style={{ background: '#fff', padding: '15px', border: '1px solid #eee' }}>
                <p style={{ color: '#999', fontSize: '13px', textTransform: 'uppercase', marginBottom: '5px' }}>Wallet Balance</p>
                <p style={{ color: '#f25648', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>₹{Number(user.wallet.balance).toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Grid */}
      <div className="row" style={{ marginBottom: '30px' }}>
        <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
          <Link href="/account/orders" style={{ textDecoration: 'none' }}>
            <div className="text-center" style={{ border: '1px solid #eee', padding: '20px', transition: 'all 0.3s' }}>
              <Package size={32} color="#4285f4" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: '#666', fontFamily: 'noto_sansbold', fontSize: '16px', margin: '10px 0 5px' }}>ORDERS</h4>
              <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>Check status</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
          <Link href="/account/addresses" style={{ textDecoration: 'none' }}>
            <div className="text-center" style={{ border: '1px solid #eee', padding: '20px' }}>
              <MapPin size={32} color="#f4b400" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: '#666', fontFamily: 'noto_sansbold', fontSize: '16px', margin: '10px 0 5px' }}>ADDRESSES</h4>
              <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>Manage delivery</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
          <Link href="/account/wishlist" style={{ textDecoration: 'none' }}>
            <div className="text-center" style={{ border: '1px solid #eee', padding: '20px' }}>
              <Heart size={32} color="#db4437" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: '#666', fontFamily: 'noto_sansbold', fontSize: '16px', margin: '10px 0 5px' }}>WISHLIST</h4>
              <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>{wishlistCount} Saved items</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
          <Link href="/account/profile" style={{ textDecoration: 'none' }}>
            <div className="text-center" style={{ border: '1px solid #eee', padding: '20px' }}>
              <User size={32} color="#a142f4" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: '#666', fontFamily: 'noto_sansbold', fontSize: '16px', margin: '10px 0 5px' }}>PROFILE</h4>
              <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>Edit details</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="row">
        {/* Recent Orders */}
        <div className="col-md-6">
          <div style={{ border: '1px solid #eee', marginBottom: '30px' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontFamily: 'noto_sansbold', color: '#666' }}>Recent Orders</h4>
              <Link href="/account/orders" style={{ color: '#f25648', fontSize: '13px', fontWeight: 'bold' }}>VIEW ALL</Link>
            </div>
            <div style={{ padding: '15px' }}>
              {user?.orders && user.orders.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {user.orders.map(order => (
                    <li key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#555' }}>#{order.orderNumber}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
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
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center" style={{ padding: '30px 0', color: '#ccc' }}>
                  <Package size={48} style={{ marginBottom: '10px', opacity: 0.3 }} />
                  <p style={{ fontSize: '14px' }}>No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Default Address */}
        <div className="col-md-6">
          <div style={{ border: '1px solid #eee', marginBottom: '30px' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontFamily: 'noto_sansbold', color: '#666' }}>Default Address</h4>
              <Link href="/account/addresses" style={{ color: '#f25648', fontSize: '13px', fontWeight: 'bold' }}>MANAGE</Link>
            </div>
            <div style={{ padding: '15px' }}>
              {user?.addresses && user.addresses.length > 0 ? (
                <div style={{ fontSize: '14px', color: '#777', lineHeight: '1.6' }}>
                  <p style={{ fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>{user.name}</p>
                  <p style={{ margin: 0 }}>{user.addresses[0].street}</p>
                  <p style={{ margin: 0 }}>{user.addresses[0].city}, {user.addresses[0].state}</p>
                  <p style={{ margin: 0 }}>{user.addresses[0].pincode}</p>
                  <p style={{ marginTop: '10px', color: '#999' }}>Phone: {user.phone}</p>
                </div>
              ) : (
                <div className="text-center" style={{ padding: '30px 0', color: '#ccc' }}>
                  <MapPin size={48} style={{ marginBottom: '10px', opacity: 0.3 }} />
                  <p style={{ fontSize: '14px' }}>No default address set</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
