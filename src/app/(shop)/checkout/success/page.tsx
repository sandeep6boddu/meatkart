import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId: string }
}) {
  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">Order Success</li>
          </ol>
        </div>
      </div>

      <section className="mutton-section">
        <div className="container">
          <div className="col-md-12">
            <div className="mutton-content" style={{ background: '#fff', padding: '60px', textAlign: 'center', border: '1px solid #ececec' }}>
              <CheckCircle size={64} color="#3c763d" style={{ marginBottom: '20px' }} />

              <h2 style={{ color: '#3c763d', fontFamily: 'noto_sansbold', margin: '0 0 10px 0' }}>
                Order Placed Successfully!
              </h2>

              <p style={{ fontFamily: 'noto_sansregular', color: '#666', fontSize: '16px', marginBottom: '20px' }}>
                Thank you for your order. We will deliver it soon.
              </p>

              {searchParams.orderId && (
                <div style={{ background: '#f9f9f9', display: 'inline-block', padding: '10px 20px', borderRadius: '4px', border: '1px solid #eee', marginBottom: '30px' }}>
                  <p style={{ margin: 0, color: '#555', fontFamily: 'noto_sansregular' }}>
                    Order ID: <span style={{ fontFamily: 'noto_sansbold' }}>{searchParams.orderId}</span>
                  </p>
                </div>
              )}

              <div>
                <Link href="/" style={{
                  background: '#f25648',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 30px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontFamily: 'noto_sansbold',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
