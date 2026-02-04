'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { useLocationStore } from '@/store/location-store'
import { useState, useEffect } from 'react'
import { getLocations } from '@/app/actions/locations'

export function MobileHeader() {
  const { city, setCity } = useLocationStore()
  const [mounted, setMounted] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    setMounted(true)
    const fetchLocations = async () => {
      const res = await getLocations()
      if (res.success && res.locations) {
        setLocations(res.locations)
      }
    }
    fetchLocations()
  }, [])

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity)
    setLocationOpen(false)
  }

  return (
    <div className="mobile-header" style={{ background: '#fff', zIndex: 1000 }}>
      <div className="mobile-header-top">
        <div className="mobile-logo">
          <Link href="/">
            <img src="/images/logo.png" alt="MeatKart" style={{ height: '32px' }} />
          </Link>
        </div>

        <div className="mobile-location">
          <button
            className="location-btn"
            onClick={() => setLocationOpen(!locationOpen)}
          >
            <MapPin size={16} style={{ color: '#f25648', marginRight: '4px' }} />
            <span className="location-text">{mounted ? city : 'Location'}</span>
            <span className="caret"></span>
          </button>

          {locationOpen && (
            <div className="mobile-location-dropdown">
              {locations.length > 0 ? (
                locations.map(loc => (
                  <button key={loc.id} onClick={() => handleCitySelect(loc.name)}>{loc.name}</button>
                ))
              ) : (
                <button disabled>Loading...</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
