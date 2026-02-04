'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useState, useEffect } from 'react'

export function MobileBottomNav() {
  const pathname = usePathname()
  const items = useCartStore((state) => state.items)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/cart', label: 'Cart', icon: ShoppingBag, badge: itemCount },
    { href: '/account', label: 'Account', icon: User }, // Or Login if not auth, but Account page handles redirect
  ]

  return (
    <div className="mobile-bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="icon-wrapper">
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge ? (
                <span className="nav-badge">{item.badge}</span>
              ) : null}
            </div>
            <span className="nav-label">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
