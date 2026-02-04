
import Link from 'next/link'
import prisma from '@/lib/prisma'
import AddToCartButton from '@/components/product/AddToCartButton'

export const dynamic = 'force-dynamic'; // Sync fix

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>
}) {
  const { q } = await searchParams
  const query = q || ''

  let products: any[] = []

  if (query) {
    try {
      products = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { name: { contains: query, mode: 'insensitive' } } }
          ]
        },
        include: {
          productImages: { where: { isPrimary: true }, take: 1 },
          productWeights: { where: { isActive: true } }
        }
      })
    } catch (error) {
      console.error('Search error:', error)
      products = []
    }
  }

  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">Search: "{query}"</li>
          </ol>
        </div>
      </div>

      <section className="mutton-section">
        <div className="container">
          <div className="col-md-12">
            <h2 className="text-center" style={{ marginBottom: 30 }}>
              {products.length > 0
                ? `Found ${products.length} results for "${query}"`
                : `No results found for "${query}"`
              }
            </h2>

            {products.length > 0 && (
              <div className="row">
                {products.map((product) => (
                  <div className="col-md-3 col-sm-6 col-xs-12 items" key={product.id}>
                    <div className="col-md-12 sellars-items">
                      <div className="add-cart">
                        <a href="#"><img src="/images/add-cart-img.png" alt="add-cart" /></a>
                      </div>
                      <Link href={`/product/${product.slug}`}>
                        <img
                          src={product.productImages[0]?.imageUrl || "/images/no-image.png"}
                          alt={product.name}
                          style={{ height: '180px', objectFit: 'contain' }}
                        />
                      </Link>
                      <h3 style={{ minHeight: '40px' }}>{product.name}</h3>

                      <div className="text-center" style={{ marginBottom: 5 }}>
                        {product.productWeights && product.productWeights.length > 0 ? (
                          (() => {
                            const sortedWeights = [...product.productWeights].sort((a: any, b: any) => Number(a.price) - Number(b.price));
                            const minWeight = sortedWeights[0];
                            return (
                              <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#ce2c2c', margin: 0 }}>
                                &#8377; {Number(minWeight.price)}
                                <span style={{ fontSize: '13px', color: '#777', fontWeight: 'normal', marginLeft: 5 }}>
                                  / {minWeight.weight}
                                </span>
                              </p>
                            )
                          })()
                        ) : (
                          <p style={{ color: '#999' }}>Unavailable</p>
                        )}
                      </div>

                      <div style={{ padding: '10px 0' }}>
                        <AddToCartButton product={{
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          imageUrl: product.productImages[0]?.imageUrl || "/images/no-image.png",
                          weights: product.productWeights?.map((w: any) => ({
                            ...w,
                            price: Number(w.price),
                            discountPrice: w.discountPrice ? Number(w.discountPrice) : null
                          })) || []
                        }} />
                      </div>
                      <p className="more-info">
                        <Link href={`/product/${product.slug}`}>More Info</Link>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center" style={{ padding: '50px 0' }}>
                <p>Try checking your spelling or use different keywords.</p>
                <Link href="/" className="btn btn-primary">Back to Home</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
