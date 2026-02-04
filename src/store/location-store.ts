import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LocationState = {
  city: string
  pincode: string | null
  setCity: (city: string) => void
  setPincode: (pincode: string) => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: 'Hyderabad', // Default city
      pincode: null,
      setCity: (city) => set({ city }),
      setPincode: (pincode) => set({ pincode }),
    }),
    {
      name: 'meatkart-location',
    }
  )
)
