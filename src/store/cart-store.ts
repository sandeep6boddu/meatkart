import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string
  weightId: string
  name: string
  price: number
  weight: string
  quantity: number
  imageUrl?: string
  cutType?: string
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, weightId: string) => void
  updateQuantity: (productId: string, weightId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId && item.weightId === newItem.weightId
          )

          if (existingItemIndex > -1) {
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += newItem.quantity
            return { items: newItems }
          }

          return { items: [...state.items, newItem] }
        })
      },
      removeItem: (productId, weightId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.weightId === weightId)
          ),
        }))
      },
      updateQuantity: (productId, weightId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId === productId && item.weightId === weightId) {
              return { ...item, quantity: Math.max(0, quantity) }
            }
            return item
          }),
        }))
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'meatkart-cart',
    }
  )
)
