import Link from 'next/link'
import prisma from '@/lib/prisma'
import BestSellers from '@/components/home/BestSellers'

export const dynamic = 'force-dynamic';

export default async function Home() {
  let products: Array<any> = []

  try {
    // Fetch Products
    products = await prisma.product.findMany({
      take: 8, // Increased take to see filtering effect better
      where: { isActive: true },
      include: {
        productImages: { where: { isPrimary: true }, take: 1 },
        productWeights: { where: { isActive: true } }
      }
    })
  } catch (error) {
    console.error("Error fetching homepage products:", error);
    products = []
  }

  // Transform for client component
  const clientProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    imageUrl: p.productImages[0]?.imageUrl || "/images/no-image.png",
    weights: p.productWeights.map((w: any) => ({
      ...w,
      price: Number(w.price),
      discountPrice: w.discountPrice ? Number(w.discountPrice) : null
    }))
  }))

  return (
    <>
      {/* Categories */}
      <section>
        <div className="categories">
          <div className="container">
            <div className="col-md-3 images">
              <div className="category-images">
                <img src="/images/mutton-bg.png" alt="image" />
                <Link href="/category/mutton" className="links">MEAT</Link>
                <h3>TOTALLY<span>HYGENIC</span></h3>
              </div>
            </div>
            <div className="col-md-3 images">
              <div className="category-images">
                <img src="/images/chicken.png" alt="image" />
                <Link href="/category/chicken" className="links-chic">CHICKEN</Link>
                <h3>ALWAYS<span> FRESH</span></h3>
              </div>
            </div>
            <div className="col-md-3 images">
              <div className="category-images">
                <img src="/images/seafood.png" alt="image" />
                <Link href="/category/seafood" className="links-sea">SEAFOOD</Link>
                <h3>PREMIUM<span> QUALITY</span></h3>
              </div>
            </div>
            <div className="col-md-3 images">
              <div className="category-images-video">
                {/* Video removed due to playback issues */}
                <div style={{ background: '#f5f5f5', height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                  <img src="/images/logo.png" alt="MeatKart" style={{ height: '40px', opacity: 0.5 }} />
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 col-xs-12 images">
              <div className="category-images-pro">
                <img src="/images/promotion2.png" alt="image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders/Coupons */}
      <div className="orders">
        <div className="container">
          <div className="col-md-6 col-sm-12 col-xs-12 ">
            <div className="col-md-12 first-order">
              <div className="col-md-4 no-gutter">
                <div className="offer">
                  <h2>ENJOY<span> 20%&nbsp;OFF*</span></h2>
                </div>
              </div>
              <div className="col-md-8  no-gutter">
                <div className="purchase-order">
                  <h3>On your first purchase of orderabove <span>&#8377;200</span></h3>
                  <p>Use Coupon Code:<img src="/images/coupon.png" alt="image" /></p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 col-xs-12 frozen-food">
            <div className="col-md-8 no-gutter">
              <div className="frozen-offer">
                <h2>5% OFF <br /><span>ON ALL FROZEN FOODS</span> </h2>
                <img src="/images/dish.png" alt="image" className="pull-right" />
              </div>
            </div>
            <div className="col-md-4 no gutter">
              <div className="shop-link">
                <a href="#">SHOP NOW</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <section className="best-sellars">
        <BestSellers products={clientProducts} />

        {/* Video Banner */}
        <div className="container">
          <div className="recipe-videos col-md-12 no-gutter">
            <a href=""><img src="/images/video-delicious.png" alt="video" /></a>
          </div>
        </div>

        {/* Certificates */}
        <div className="container">
          <div className="col-md-6">
            <div className="certificate">
              <img src="/images/guarentee.png" alt="image" />
              <ul>
                <li><span></span> Hand-cut & Trimmed</li>
                <li><span></span> Products are Tested for Purity</li>
                <li><span></span> 100% Guaranteed Fresh</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="transport">
              <img src="/images/transport.png" alt="image" />
              <ul>
                <li><span></span> Free Shipping on orders above `400</li>
                <li><span></span> Choose Your Own Delivery Time</li>
                <li><span></span> Cash on Delivery Available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
