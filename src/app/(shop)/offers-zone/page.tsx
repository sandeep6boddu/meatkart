
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'

export const dynamic = 'force-dynamic'; // Sync fix

export default async function OffersZonePage() {
  // Fetch products with discounts
  const discountedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      productWeights: {
        some: {
          discountPrice: { not: null }
        }
      }
    },
    include: {
      productImages: { where: { isPrimary: true }, take: 1 },
      productWeights: { where: { isActive: true } }
    }
  })

  // Transform for client component
  const products = discountedProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    imageUrl: p.productImages[0]?.imageUrl || "/images/no-image.png",
    weights: p.productWeights.map(w => ({
      id: w.id,
      weight: w.weight,
      price: Number(w.price),
      discountPrice: w.discountPrice ? Number(w.discountPrice) : null
    })),
    freshnessNotes: p.freshnessNotes
  }))

  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">Offers Zone</li>
          </ol>
        </div>
      </div>

      <section className="offers-section" style={{ padding: '40px 0' }}>
        <div className="container">
          {/* Static Offers */}
          <div className="row" style={{ marginBottom: '40px' }}>
            <div className="col-md-12 text-center">
              <h2 style={{ marginBottom: '20px', textTransform: 'uppercase', fontWeight: 'bold' }}>Special Offers</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div style={{
                padding: '20px',
                backgroundColor: '#fff5f5',
                borderRadius: '8px',
                border: '1px solid #fed7d7',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#c53030', margin: '0 0 10px 0', fontSize: '24px' }}>First Order Special</h3>
                <p style={{ color: '#4a5568', fontSize: '16px' }}>Get 20% OFF on your first order above ₹200</p>
                <div style={{ marginTop: '15px' }}>
                  <span style={{
                    backgroundColor: 'white',
                    padding: '8px 16px',
                    border: '2px dashed #fc8181',
                    borderRadius: '4px',
                    color: '#e53e3e',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    fontSize: '18px'
                  }}>WELCOME20</span>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div style={{
                padding: '20px',
                backgroundColor: '#ebf8ff',
                borderRadius: '8px',
                border: '1px solid #bee3f8',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#2b6cb0', margin: '0 0 10px 0', fontSize: '24px' }}>Frozen Foods Deal</h3>
                <p style={{ color: '#4a5568', fontSize: '16px' }}>Flat 5% OFF on all frozen food items</p>
                <div style={{ marginTop: '15px' }}>
                  <span style={{
                    backgroundColor: 'white',
                    padding: '8px 16px',
                    border: '2px dashed #63b3ed',
                    borderRadius: '4px',
                    color: '#3182ce',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    fontSize: '18px'
                  }}>FROZEN5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Discounted Products Grid */}
          <div className="row" style={{ marginTop: '40px' }}>
            <div className="col-md-12">
              <h3 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px' }}>Best Price Drops</h3>
            </div>
            {products.length > 0 ? (
              products.map(product => (
                <div className="col-md-3 col-sm-6 col-xs-12" style={{ marginBottom: '30px' }} key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-md-12 text-center py-8">
                <p>No product offers available right now. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
