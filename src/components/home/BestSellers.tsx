'use client'

import Link from 'next/link'
import { useLocationStore } from '@/store/location-store'
import { useState, useEffect } from 'react'
import ProductCard from '../product/ProductCard'

type Product = {
  id: string
  name: string
  slug: string
  imageUrl: string
  weights: any[]
}

export default function BestSellers({ products }: { products: Product[] }) {
  const { city } = useLocationStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const availableProducts = products;

  return (
    <div className="container">
      <div className="sellars-heading">
        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
          <span>best-sellers in {city}</span>
        </div>
      </div>

      <div className="row" style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap' }}>
        {availableProducts.length === 0 ? (
          <div className="col-md-12 text-center">
            <p>No products available in {city} at the moment.</p>
          </div>
        ) : (
          availableProducts.map((product) => (
            // Force strict 25% width for col-md-3 to avoid flex issues
            <div className="col-md-3 col-sm-6 col-xs-6" key={product.id} style={{ marginBottom: 30, display: 'flex', width: '25%' }}>
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
