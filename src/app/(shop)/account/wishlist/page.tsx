import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      wishlist: {
        include: {
          items: {
            include: {
              product: {
                include: {
                  productImages: {
                    where: { isPrimary: true },
                    take: 1
                  },
                  productWeights: {
                    where: { isActive: true },
                    take: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  const wishlistItems = user?.wishlist?.items || []

  return (
    <div className="account-wishlist">
      <h2 style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '24px', margin: '0 0 25px 0', textTransform: 'uppercase' }}>
        My Wishlist
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center" style={{ border: '2px dashed #eee', padding: '50px 0', background: '#fff' }}>
          <Heart size={48} color="#ccc" style={{ marginBottom: '15px' }} />
          <h3 style={{ color: '#666', fontFamily: 'noto_sansbold', fontSize: '18px' }}>Your wishlist is empty</h3>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>Save items you want to buy later.</p>
          <Link href="/">
            <button className="btn btn-danger" style={{ borderRadius: 0, background: '#f25648', borderColor: '#f25648', padding: '10px 25px', fontWeight: 'bold' }}>
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      ) : (
        <div className="row">
          {wishlistItems.map((item) => {
            const product = item.product
            const image = product.productImages[0]?.imageUrl || '/images/no-image.png'
            const price = product.productWeights[0]?.price || 0

            return (
              <div key={item.id} className="col-md-4 col-sm-6" style={{ marginBottom: '30px' }}>
                <div style={{ border: '1px solid #eee', background: '#fff' }}>
                  <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', background: '#f9f9f9' }}>
                    <img
                      src={image}
                      alt={product.name}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button style={{ position: 'absolute', top: '10px', right: '10px', background: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f25648', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>
                  <div style={{ padding: '15px' }}>
                    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                      <h4 style={{ color: '#666', fontFamily: 'noto_sansbold', fontSize: '15px', margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                      </h4>
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>₹{Number(price).toFixed(2)}</span>
                      <button className="btn btn-default" style={{ borderRadius: 0, fontSize: '11px', fontWeight: 'bold', background: '#fcfcfc' }}>
                        <ShoppingCart size={12} style={{ marginRight: '5px' }} /> ADD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
