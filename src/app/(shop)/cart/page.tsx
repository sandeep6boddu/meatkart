"use client"

import Link from 'next/link'
import { useCartStore } from '@/store/cart-store'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const getTotal = useCartStore((s) => s.getTotal)

  // Custom styles to match homepage & auth pages
  const headerStyle = {
    fontFamily: 'noto_sansbold',
    color: '#666666',
    fontSize: '24px',
    marginBottom: '20px',
    textTransform: 'uppercase' as const,
    borderBottom: '2px solid #e5e5e5',
    paddingBottom: '10px'
  }

  const itemTitleStyle = {
    fontFamily: 'noto_sansbold',
    color: '#333',
    fontSize: '18px',
    margin: '0 0 5px 0'
  }

  const itemMetaStyle = {
    fontFamily: 'noto_sansregular',
    color: '#999',
    fontSize: '14px'
  }

  const priceStyle = {
    fontFamily: 'noto_sansbold',
    color: '#f25648',
    fontSize: '16px'
  }

  const quantityBtnStyle = {
    border: '1px solid #e5e5e5',
    background: '#fff',
    padding: '5px 10px',
    color: '#666',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  }

  const quantityInputStyle = {
    border: '1px solid #e5e5e5',
    borderLeft: 'none',
    borderRight: 'none',
    width: '40px',
    textAlign: 'center' as const,
    height: '32px',
    display: 'inline-block',
    verticalAlign: 'middle'
  }

  const checkoutBtnStyle = {
    background: '#f25648',
    color: '#fff',
    border: 'none',
    borderRadius: '0',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    textTransform: 'uppercase' as const,
    padding: '12px 20px',
    width: '100%',
    fontFamily: 'noto_sansbold',
    marginTop: '20px',
    display: 'block',
    textAlign: 'center' as const
  }

  return (
    <div style={{ background: '#f4f2e9', minHeight: '600px', paddingBottom: '60px' }}>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">Cart</li>
          </ol>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        <h1 style={headerStyle}>Shopping Cart</h1>

        <div className="row">
          {/* Cart Items Column */}
          <div className="col-md-8">
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', padding: '20px' }}>
              {items.length === 0 ? (
                <div className="text-center" style={{ padding: '40px' }}>
                  <p style={{ ...itemMetaStyle, fontSize: '18px' }}>Your cart is empty</p>
                  <Link href="/" className="btn btn-default" style={{ marginTop: '20px', fontFamily: 'noto_sansbold' }}>Start Shopping</Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.productId}-${item.weightId}`} className="row" style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div className="col-xs-3 col-sm-2">
                      <img src={item.imageUrl || '/images/no-image.png'} alt={item.name} className="img-responsive" style={{ border: '1px solid #eee' }} />
                    </div>
                    <div className="col-xs-9 col-sm-10">
                      <div className="row">
                        <div className="col-sm-6">
                          <h4 style={itemTitleStyle}>{item.name}</h4>
                          <p style={itemMetaStyle}>Weight: {item.weight}</p>
                          <p style={{ ...priceStyle, marginTop: '5px' }}>Unit Price: &#8377; {item.price}</p>
                        </div>
                        <div className="col-sm-3 text-center">
                          <div style={{ marginTop: '10px' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); updateQuantity(item.productId, item.weightId, Math.max(0, item.quantity - 1)); }} style={quantityBtnStyle}>-</a>
                            <input type="text" value={item.quantity} readOnly style={quantityInputStyle} />
                            <a href="#" onClick={(e) => { e.preventDefault(); updateQuantity(item.productId, item.weightId, item.quantity + 1); }} style={quantityBtnStyle}>+</a>
                          </div>
                        </div>
                        <div className="col-sm-3 text-right">
                          <p style={{ ...priceStyle, fontSize: '20px', marginTop: '10px' }}>&#8377; {item.price * item.quantity}</p>
                          <a href="#" onClick={(e) => { e.preventDefault(); removeItem(item.productId, item.weightId); }} style={{ color: '#999', fontSize: '12px', textDecoration: 'underline' }}>Remove</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Checkout/Summary Column */}
          <div className="col-md-4">
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', padding: '20px' }}>
              <h4 style={{ ...headerStyle, fontSize: '18px', borderBottom: 'none', marginBottom: '10px' }}>Order Summary</h4>
              <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '15px' }}>
                <div className="row" style={{ marginBottom: '10px' }}>
                  <div className="col-xs-6" style={itemMetaStyle}>Subtotal</div>
                  <div className="col-xs-6 text-right" style={itemTitleStyle}>&#8377; {getTotal()}</div>
                </div>
                <div className="row" style={{ marginBottom: '10px' }}>
                  <div className="col-xs-6" style={itemMetaStyle}>Shipping</div>
                  <div className="col-xs-6 text-right" style={{ ...itemMetaStyle, color: 'green' }}>Free</div>
                </div>
                <div className="row" style={{ borderTop: '2px solid #eee', paddingTop: '15px', marginTop: '15px' }}>
                  <div className="col-xs-6" style={{ ...itemTitleStyle, fontSize: '20px' }}>Total</div>
                  <div className="col-xs-6 text-right" style={{ ...priceStyle, fontSize: '24px' }}>&#8377; {getTotal()}</div>
                </div>

                {items.length > 0 ? (
                  <Link href="/checkout" style={checkoutBtnStyle}>Proceed to Checkout</Link>
                ) : (
                  <button style={{ ...checkoutBtnStyle, background: '#ccc', cursor: 'not-allowed' }} disabled>Proceed to Checkout</button>
                )}
              </div>
            </div>

            <div style={{ marginTop: '20px', background: '#fff', border: '1px solid #e5e5e5', padding: '20px' }}>
              <h5 style={{ ...itemTitleStyle, fontSize: '14px', textTransform: 'uppercase' }}>We Guarantee</h5>
              <ul style={{ paddingLeft: '20px', marginTop: '10px', ...itemMetaStyle }}>
                <li style={{ marginBottom: '5px' }}>100% Fresh Meat</li>
                <li style={{ marginBottom: '5px' }}>Farm-to-Door Delivery</li>
                <li style={{ marginBottom: '5px' }}>Hygienically Packed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

