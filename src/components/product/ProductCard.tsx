'use client'

import Link from 'next/link'
import AddToCartButton from './AddToCartButton'
import { useState, useEffect } from 'react'

type Product = {
  id: string
  name: string
  slug: string
  imageUrl: string
  weights: { id: string; weight: string; price: number, discountPrice?: number | null }[]
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth < 1024) // Increased breakpoint for tablet support
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Sort weights to find the cheapest option to display
  const sortedWeights = [...product.weights].sort((a, b) => Number(a.price) - Number(b.price))
  const mainWeight = sortedWeights[0]

  // Button should be visible if: mobile OR hovered
  const showButton = isMobile || isHovered

  return (
    <div className="product-card" style={{
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      padding: '15px',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      border: '1px solid #eee',
      transition: 'all 0.3s ease',
      width: '100%' // Ensure card takes full width of container
    }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image Area with overlay button */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <Link href={`/product/${product.slug}`} style={{ display: 'block', textAlign: 'center' }}>
          <div style={{
            height: '180px', // Fixed height for image container
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff', // White background for non-square images
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <img
              src={product.imageUrl || "/images/no-image.png"}
              alt={product.name}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain', // Ensure image fits without cropping
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
        </Link>

        {/* Add to Cart Button Overlay - appears on hover (desktop) or always (mobile) */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 30px)',
          opacity: showButton || isMobile ? 1 : 0,
          visibility: showButton || isMobile ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          pointerEvents: showButton || isMobile ? 'auto' : 'none',
          zIndex: 10
        }}>
          <AddToCartButton product={product} variant="minimal" />
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '5px',
            lineHeight: '1.4',
            height: '48px', // Fixed height for 2 lines
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Short description or weight if available */}
        {mainWeight ? (
          <p style={{ color: '#777', fontSize: '13px', marginBottom: '10px' }}>
            Net wt: {mainWeight.weight}
          </p>
        ) : (
          <p style={{ color: '#999', fontSize: '13px', marginBottom: '10px' }}>Unavailable</p>
        )}

        {/* Price & Add Button Row */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="price-info">
            {mainWeight && (
              <>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f25648', fontFamily: 'noto_sansbold' }}>
                  &#8377;{Number(mainWeight.price)}
                </span>
                {mainWeight.discountPrice && (
                  <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through', marginLeft: '5px' }}>
                    &#8377;{mainWeight.discountPrice}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
