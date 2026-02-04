'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart-store'

type Product = {
  id: string
  name: string
  categoryName: string
  imageUrl: string
  weights: { id: string; weight: string; price: number }[]
}

export default function TestFlowClient({ products }: { products: Product[] }) {
  // 1. Hydration safety
  const [mounted, setMounted] = useState(false)
  const cartItems = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const getTotal = useCartStore((s) => s.getTotal)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 2. Checkout State
  const [status, setStatus] = useState('')

  const handleAddToCart = (product: Product) => {
    if (!product.weights.length) {
      alert('No weights available')
      return
    }
    const w = product.weights[0]
    addItem({
      productId: product.id,
      weightId: w.id,
      name: product.name,
      price: w.price,
      weight: w.weight,
      quantity: 1,
      imageUrl: product.imageUrl
    })
  }

  const handleCheckout = async () => {
    setStatus('Processing...')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: getTotal(),
          customer: {
            name: 'Test User',
            phone: '9999999999',
            address: 'Test Address',
            city: 'Test City',
            pincode: '500000'
          }
        })
      })
      const data = await res.json()
      if (res.ok) {
        setStatus(`Success! Order ID: ${data.orderId}`)
        clearCart()
      } else {
        setStatus(`Error: ${data.error}. Details: ${data.details || 'None'}${data.stack ? `\n\nStack: ${data.stack}` : ''}`)
      }
    } catch (e: any) {
      setStatus(`Exception: ${e.message}`)
    }
  }

  if (!mounted) return <div>Loading Store...</div>

  return (
    <div style={{ display: 'flex', gap: 40 }}>
      {/* Product List */}
      <div style={{ flex: 1 }}>
        <h2>1. Products ({products.length})</h2>
        <div style={{ display: 'grid', gap: 20 }}>
          {products.map(p => (
            <div key={p.id} style={{ border: '1px solid #ccc', padding: 10 }}>
              <h3>{p.name}</h3>
              <p>Category: {p.categoryName}</p>
              {p.weights.length > 0 ? (
                <p>Price: {p.weights[0].price} / {p.weights[0].weight}</p>
              ) : (
                <p style={{ color: 'red' }}>Unavailable</p>
              )}
              <button
                onClick={() => handleAddToCart(p)}
                style={{ background: 'blue', color: 'white', padding: '8px 16px', cursor: 'pointer' }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div style={{ flex: 1, borderLeft: '2px solid #eee', paddingLeft: 40 }}>
        <h2>2. Cart ({cartItems.length} items)</h2>
        <pre style={{ background: '#f5f5f5', padding: 10, fontSize: 12 }}>
          {JSON.stringify(cartItems, null, 2)}
        </pre>

        {cartItems.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>Total: {getTotal()}</h3>
            <button
              onClick={() => removeItem(cartItems[0].productId, cartItems[0].weightId)}
              style={{ marginRight: 10 }}
            >
              Remove First Item
            </button>
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        )}

        <hr />

        <h2>3. Checkout Test</h2>
        <p>Will create an order for "Test User" (Phone: 9999999999)</p>
        <button
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
          style={{
            background: 'green',
            color: 'white',
            padding: '10px 20px',
            fontSize: 16,
            cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
            opacity: cartItems.length === 0 ? 0.5 : 1
          }}
        >
          Place Test Order
        </button>

        {status && (
          <div style={{ marginTop: 20, padding: 10, background: '#eee' }}>
            <strong>Status:</strong> {status}
          </div>
        )}
      </div>
    </div>
  )
}
