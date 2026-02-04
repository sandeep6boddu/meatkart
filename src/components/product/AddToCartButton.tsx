'use client'

import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

type Product = {
  id: string
  name: string
  slug: string
  imageUrl: string
  weights: { id: string; weight: string; price: number }[]
}

export default function AddToCartButton({
  product,
  variant = 'primary',
  externalWeightId,
  cutType
}: {
  product: Product,
  variant?: 'primary' | 'minimal',
  externalWeightId?: string,
  cutType?: string
}) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const btnStyle = {
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
    cursor: 'pointer',
    transition: 'background 0.3s'
  }

  const minimalBtnStyle = {
    ...btnStyle,
    background: '#fff',
    color: '#f25648',
    border: '1px solid #f25648'
  }

  const disabledBtnStyle = {
    ...btnStyle,
    background: '#ccc',
    cursor: 'not-allowed'
  }

  const qtyContainerStyle = {
    display: 'inline-block',
    border: '1px solid #f25648',
    background: '#fff',
    borderRadius: '4px',
    padding: '5px',
    width: '100%',
    maxWidth: '160px',
    textAlign: 'center' as const
  }

  const qtyBtnStyle = {
    background: 'none',
    border: 'none',
    color: '#f25648',
    fontSize: '20px',
    fontWeight: 'bold' as const,
    padding: '0 15px',
    cursor: 'pointer'
  }

  const qtyTextStyle = {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    margin: '0 10px',
    color: '#333'
  }

  if (!mounted) return <button style={disabledBtnStyle} disabled>Add to cart</button>

  // Use externalWeightId if provided, otherwise default to first weight
  const activeWeightId = externalWeightId || product.weights[0]?.id
  const activeWeight = product.weights.find(w => w.id === activeWeightId)

  const cartItem = activeWeight
    ? items.find(i => i.productId === product.id && i.weightId === activeWeightId && i.cutType === cutType)
    : null

  const quantity = cartItem ? cartItem.quantity : 0

  const handleAdd = () => {
    if (!activeWeight) {
      toast.error('Product currently unavailable')
      return
    }

    addItem({
      productId: product.id,
      weightId: activeWeight.id,
      name: product.name,
      price: Number(activeWeight.price),
      weight: activeWeight.weight,
      quantity: 1,
      imageUrl: product.imageUrl,
      cutType: cutType
    })
    toast.success('Added to cart!')
  }

  const handleIncrement = () => {
    if (cartItem && activeWeight) {
      updateQuantity(product.id, activeWeight.id, quantity + 1)
    } else {
      handleAdd()
    }
  }

  const handleDecrement = () => {
    if (cartItem && activeWeight) {
      updateQuantity(product.id, activeWeight.id, Math.max(0, quantity - 1))
    }
  }

  if (quantity > 0) {
    return (
      <div style={qtyContainerStyle}>
        <button onClick={handleDecrement} style={qtyBtnStyle}>-</button>
        <span style={qtyTextStyle}>{quantity}</span>
        <button onClick={handleIncrement} style={qtyBtnStyle}>+</button>
      </div>
    )
  }

  return (
    <button
      style={variant === 'minimal' ? minimalBtnStyle : btnStyle}
      type="button"
      onClick={handleAdd}
      onMouseOver={(e) => {
        if (variant !== 'minimal') e.currentTarget.style.background = '#d14030';
        else e.currentTarget.style.background = '#fff5f5';
      }}
      onMouseOut={(e) => {
        if (variant !== 'minimal') e.currentTarget.style.background = '#f25648';
        else e.currentTarget.style.background = '#fff';
      }}
    >
      Add to cart
    </button>
  )
}

