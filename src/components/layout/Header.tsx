'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { useLocationStore } from '@/store/location-store'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

import { getLocations } from '@/app/actions/locations'

export function Header() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const { city, setCity } = useLocationStore()
  const [mounted, setMounted] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([])
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)

    // Check auth state
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Fetch locations
    const fetchLocations = async () => {
      const res = await getLocations()
      if (res.success && res.locations) {
        setLocations(res.locations)
      }
    }
    fetchLocations()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity)
    setLocationOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const itemCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0

  return (
    <header>
      <div className="top-header">
        <div className="container">
          <div id="logo">
            <div className="col-md-4 col-xs-12 col-sm-12">
              <Link href="/"><img src="/images/logo.png" alt="logo" /></Link>
            </div>
          </div>
          <div className="col-md-8 col-xs-12 col-sm-12 no-gutter">
            <div className="col-md-4  no-gutter top-header-content">
              <div className="col-md-12  no-gutter">
                <p className="pull-left">Location:</p>
                <div className={`dropdown drop-down-content ${locationOpen ? 'open' : ''}`}>
                  <button
                    className="btn btn-default dropdown-toggle drop-down-button"
                    type="button"
                    id="dropdownMenu1"
                    onClick={() => setLocationOpen(!locationOpen)}
                    aria-haspopup="true"
                    aria-expanded={locationOpen}
                  >
                    {mounted ? city : 'Location'}
                    <span className="caret click"></span>
                  </button>
                  <ul className="dropdown-menu locations" aria-labelledby="dropdownMenu1">
                    {locations.length > 0 ? (
                      locations.map((loc) => (
                        <li key={loc.id}>
                          <a href="#" onClick={(e) => { e.preventDefault(); handleCitySelect(loc.name); }}>
                            {loc.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li><a href="#">Loading...</a></li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4 no-gutter top-header-content text-center phone">
              <p>Order by Phone: 040 64629595</p>
            </div>
            <div className="col-md-2 no-gutter top-header-content text-center platter">
              <p><Link href="/platter">My Platter</Link></p>
            </div>
            <div className="col-md-2 no-gutter top-header-content text-center sign-up login">
              {mounted && user ? (
                <Link href="/account">My Account</Link>
              ) : (
                <Link href="/auth/login">Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="second-header">
        <div className="container">
          <div className="col-md-6 col-sm-12 col-xs-12">
            <div className="home-icon">
            </div>
            <nav>
              <ul className="menu">
                <li><Link href="/category/mutton">Mutton</Link></li>
                <li><Link href="/category/chicken">chicken</Link></li>
                <li><Link href="/category/seafood">sea food</Link></li>
                <li><Link href="/category/ready-to-cook">Ready to Cook</Link></li>

                <li
                  className={`dropdown ${moreOpen ? 'open' : ''}`}
                  style={{ listStyle: 'none', position: 'relative' }}
                  onMouseEnter={() => setMoreOpen(true)}
                  onMouseLeave={() => setMoreOpen(false)}
                >
                  <a
                    href="#"
                    className="dropdown-toggle"
                    onClick={(e) => e.preventDefault()}
                    aria-haspopup="true"
                    aria-expanded={moreOpen}
                  >
                    More <span className="caret"></span>
                  </a>
                  <ul
                    className="dropdown-menu"
                    style={{
                      display: moreOpen ? 'block' : 'none',
                      marginTop: '0',
                      borderRadius: '0',
                      border: '1px solid #e2e2e2',
                      boxShadow: 'none',
                      minWidth: '180px'
                    }}
                  >
                    <li><Link href="/category/eggs" style={{ padding: '10px 15px', color: '#666' }}>Eggs</Link></li>
                    <li><Link href="/category/cold-cuts" style={{ padding: '10px 15px', color: '#666' }}>Cold Cuts</Link></li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-md-6 col-sm-12 col-xs-12 search">
            <div className=" col-md-8 no-gutter">
              <form onSubmit={handleSearch} className="input-group search-bar">
                <a href="#" onClick={(e) => { e.preventDefault(); handleSearch(e); }}><img src="/images/search-icon.png" alt="search-img" className=" search-img" /></a>
                <input
                  type="text"
                  className="form-control search-bar-control"
                  placeholder=" Search by keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="submit">search</button>
                </span>
              </form>
            </div>
            <div className="shopping">
              <Link href="/cart">
                <img src="/images/shopping.png" alt="icon " className="pull-left" />
                shopping bag<span className="pull-left">({itemCount} items)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
