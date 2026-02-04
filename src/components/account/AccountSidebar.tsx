'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ShoppingBag, MapPin, LogOut, Heart, Wallet, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const links = [
    { href: '/account', label: 'Overview', icon: User },
    { href: '/account/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/account/addresses', label: 'Addresses', icon: MapPin },
    { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/account/wallet', label: 'Wallet', icon: Wallet },
    { href: '/account/profile', label: 'Profile', icon: User },
    // { href: '/account/notifications', label: 'Notifications', icon: Bell },
  ]

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged out successfully')
      router.push('/auth/login')
      router.refresh()
    }
  }

  return (
    <div className="product-list no-gutter">
      <h2>MY ACCOUNT</h2>
      <ul className="mutton-menu-list">
        {links.map((link) => {
          const isActive = pathname === link.href

          return (
            <li key={link.href} className={isActive ? 'active' : ''}>
              <span>&#9679;</span>
              <Link href={link.href}>
                {link.label}
              </Link>
            </li>
          )
        })}

        <li style={{ marginTop: '10px', borderTop: '1px solid #ececec', paddingTop: '10px' }}>
          <span>&#9679;</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              paddingLeft: '20px',
              fontSize: '15px',
              color: '#666666',
              fontFamily: 'noto_sansregular',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  )
}
