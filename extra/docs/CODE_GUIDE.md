# 🗺️ MeatKart - Code Navigation Guide

This guide helps you understand where to find specific functionality in the codebase.

---

## 🎯 Quick Reference

### "I want to..."

#### Frontend/UI Changes

| Task | Location |
|------|----------|
| Change homepage layout | `src/app/(shop)/page.tsx` |
| Modify header/navigation | `src/components/layout/Header.tsx` |
| Update footer | `src/components/layout/Footer.tsx` |
| Change mobile header | `src/components/layout/MobileHeader.tsx` |
| Modify product card design | `src/components/product/ProductCard.tsx` |
| Update cart page | `src/app/(shop)/cart/page.tsx` |
| Change checkout flow | `src/app/(shop)/checkout/page.tsx` |
| Modify login form | `src/components/auth/LoginForm.tsx` |
| Update signup form | `src/components/auth/SimpleSignupForm.tsx` |

#### Backend/Logic Changes

| Task | Location |
|------|----------|
| Add user functionality | `src/app/actions/user.ts` |
| Modify product logic | `src/app/actions/product.ts` |
| Change order processing | `src/app/actions/order.ts` |
| Update category logic | `src/app/actions/category.ts` |
| Add API endpoint | `src/app/api/` |
| Modify database schema | `prisma/schema.prisma` |

#### Admin Panel Changes

| Task | Location |
|------|----------|
| Update admin dashboard | `src/app/(admin)/admin/page.tsx` |
| Modify product management | `src/app/(admin)/admin/products/` |
| Change category management | `src/app/(admin)/admin/categories/` |
| Update order management | `src/app/(admin)/admin/orders/` |
| Modify user management | `src/app/(admin)/admin/users/` |

#### Configuration Changes

| Task | Location |
|------|----------|
| Add environment variables | `.env.local` |
| Modify Next.js config | `next.config.ts` |
| Update Tailwind config | `tailwind.config.js` |
| Change TypeScript config | `tsconfig.json` |
| Modify database schema | `prisma/schema.prisma` |

---

## 📂 Detailed File Structure

### `/src/app/` - Application Routes

```
app/
├── (admin)/                    # Admin section (route group)
│   ├── admin/
│   │   ├── page.tsx           # Dashboard - /admin
│   │   ├── products/
│   │   │   ├── page.tsx       # Product list - /admin/products
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Edit product - /admin/products/[id]
│   │   ├── categories/
│   │   │   └── page.tsx       # Categories - /admin/categories
│   │   ├── orders/
│   │   │   └── page.tsx       # Orders - /admin/orders
│   │   └── users/
│   │       └── page.tsx       # Users - /admin/users
│   └── layout.tsx             # Admin layout wrapper
│
├── (shop)/                     # Customer section (route group)
│   ├── page.tsx               # Homepage - /
│   ├── layout.tsx             # Shop layout (header, footer)
│   ├── cart/
│   │   └── page.tsx           # Shopping cart - /cart
│   ├── checkout/
│   │   ├── page.tsx           # Checkout - /checkout
│   │   └── success/
│   │       └── page.tsx       # Order success - /checkout/success
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx       # Category page - /category/mutton
│   ├── product/
│   │   ├── [slug]/
│   │   │   └── page.tsx       # Product details - /product/boneless-chicken
│   │   └── page.tsx           # All products - /product
│   ├── account/
│   │   ├── page.tsx           # Account home - /account
│   │   ├── orders/
│   │   │   ├── page.tsx       # Order history - /account/orders
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Order details - /account/orders/[id]
│   │   ├── addresses/
│   │   │   └── page.tsx       # Manage addresses - /account/addresses
│   │   ├── wallet/
│   │   │   └── page.tsx       # Wallet - /account/wallet
│   │   └── profile/
│   │       └── page.tsx       # Profile - /account/profile
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx       # Login - /auth/login
│   │   └── signup/
│   │       └── page.tsx       # Signup - /auth/signup
│   ├── search/
│   │   └── page.tsx           # Search results - /search?q=chicken
│   └── offers-zone/
│       └── page.tsx           # Offers - /offers-zone
│
├── actions/                    # Server Actions (Backend Logic)
│   ├── user.ts                # User operations
│   ├── product.ts             # Product operations
│   ├── category.ts            # Category operations
│   └── order.ts               # Order operations
│
├── api/                        # API Routes
│   ├── checkout/
│   │   └── route.ts           # POST /api/checkout
│   └── health/
│       └── route.ts           # GET /api/health
│
├── globals.css                 # Global styles
└── favicon.ico                 # Favicon
```

---

## 🧩 Components Structure

### `/src/components/` - Reusable Components

```
components/
├── layout/                     # Layout components
│   ├── Header.tsx             # Desktop header with nav, search, cart
│   ├── MobileHeader.tsx       # Mobile header (fixed top)
│   ├── Footer.tsx             # Footer with links, contact
│   └── MobileBottomNav.tsx    # Mobile bottom navigation
│
├── product/                    # Product-related components
│   ├── ProductCard.tsx        # Product card (image, name, price)
│   └── AddToCartButton.tsx    # Add to cart button with logic
│
├── category/                   # Category components
│   └── CategoryCard.tsx       # Category card with image
│
├── home/                       # Homepage components
│   └── BestSellers.tsx        # Best sellers section
│
├── auth/                       # Authentication components
│   ├── LoginForm.tsx          # Full login form
│   ├── LoginModal.tsx         # Login modal popup
│   ├── SimpleLoginForm.tsx    # Simplified login
│   └── SimpleSignupForm.tsx   # Simplified signup
│
├── account/                    # Account page components
│   ├── AccountSidebar.tsx     # Account navigation sidebar
│   ├── AddAddressDialog.tsx   # Add/edit address dialog
│   ├── AddressCard.tsx        # Address display card
│   └── PrintInvoiceButton.tsx # Print invoice button
│
├── admin/                      # Admin components
│   ├── LogoutButton.tsx       # Admin logout
│   ├── categories/
│   │   ├── CategoryForm.tsx   # Add/edit category form
│   │   └── CategoryList.tsx   # Category list table
│   ├── products/
│   │   ├── ProductForm.tsx    # Add/edit product form
│   │   └── ProductList.tsx    # Product list table
│   └── orders/
│       └── OrderList.tsx      # Order list table
│
└── ui/                         # Base UI components (Radix UI)
    ├── button.tsx             # Button component
    ├── card.tsx               # Card component
    ├── dialog.tsx             # Dialog/Modal component
    ├── input.tsx              # Input component
    ├── label.tsx              # Label component
    ├── select.tsx             # Select dropdown component
    ├── checkbox.tsx           # Checkbox component
    ├── badge.tsx              # Badge component
    └── separator.tsx          # Separator line component
```

---

## 🔧 Core Logic Files

### `/src/lib/` - Utility & Configuration

```
lib/
├── prisma.ts                   # Prisma client singleton
│   └── Exports: prisma (default)
│
├── utils.ts                    # Utility functions
│   └── Exports: cn() - className merger
│
└── supabase/                   # Supabase clients
    ├── client.ts              # Browser client
    │   └── Exports: createClient()
    ├── server.ts              # Server client
    │   └── Exports: createClient()
    └── middleware.ts          # Auth middleware
        └── Exports: updateSession()
```

### `/src/store/` - State Management

```
store/
├── cart-store.ts               # Shopping cart state
│   └── Exports: useCartStore
│       ├── items: CartItem[]
│       ├── addItem(item)
│       ├── removeItem(productId, weightId)
│       ├── updateQuantity(productId, weightId, qty)
│       ├── clearCart()
│       └── getTotal()
│
└── location-store.ts           # Location state
    └── Exports: useLocationStore
        ├── city: string
        └── setCity(city)
```

---

## 🗄️ Database & Prisma

### `/prisma/` - Database Configuration

```
prisma/
├── schema.prisma               # Database schema definition
│   └── Defines:
│       ├── User model
│       ├── Category model
│       ├── Product model
│       ├── ProductImage model
│       ├── ProductWeight model
│       ├── CartItem model
│       ├── Order model
│       ├── OrderItem model
│       ├── Address model
│       ├── Payment model
│       ├── Delivery model
│       ├── Wishlist model
│       ├── WishlistItem model
│       ├── Wallet model
│       ├── WalletTransaction model
│       └── NotificationPreference model
│
├── migrations/                 # Database migrations
│   └── YYYYMMDDHHMMSS_name/
│       └── migration.sql
│
├── seed.ts                     # Seed data script
└── create-user.ts              # User creation utility
```

---

## 🎨 Styling Files

### `/public/css/` - Legacy CSS

```
css/
├── bootstrap.min.css           # Bootstrap 3 framework
├── style.css                   # Main custom styles
├── mediaqueries.css            # Responsive styles
└── mobile-app.css              # Mobile-specific styles
```

### Tailwind CSS
- Configuration: `tailwind.config.js`
- Global styles: `src/app/globals.css`
- Utility classes used throughout components

---

## 🖼️ Static Assets

### `/public/` - Static Files

```
public/
├── images/                     # All images
│   ├── logo.png               # Site logo
│   ├── mutton-bg.png          # Category images
│   ├── chicken.png
│   ├── seafood.png
│   ├── shopping.png           # Icons
│   ├── search-icon.png
│   └── ... (many more)
│
├── fonts/                      # Web fonts
│   ├── notosans-*.woff
│   ├── opensans-*.woff
│   └── glyphicons-*.woff
│
└── css/                        # CSS files (see above)
```

---

## 🔐 Configuration Files

### Root Configuration Files

```
/
├── .env.local                  # Environment variables (create this)
├── .env.example                # Environment template
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.mjs          # PostCSS configuration
├── package.json                # Dependencies & scripts
├── middleware.ts               # Next.js middleware (auth)
└── vercel.json                 # Vercel deployment config
```

---

## 🚀 Common Code Patterns

### 1. Server Component (Data Fetching)

```typescript
// src/app/(shop)/page.tsx
import prisma from '@/lib/prisma'

export default async function Page() {
  // Fetch data on server
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { productImages: true }
  })
  
  return <div>{/* Render products */}</div>
}
```

### 2. Client Component (Interactivity)

```typescript
// src/components/product/AddToCartButton.tsx
'use client'

import { useCartStore } from '@/store/cart-store'

export function AddToCartButton({ product }) {
  const addItem = useCartStore(state => state.addItem)
  
  const handleClick = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    })
  }
  
  return <button onClick={handleClick}>Add to Cart</button>
}
```

### 3. Server Action

```typescript
// src/app/actions/product.ts
'use server'

import prisma from '@/lib/prisma'

export async function createProduct(data: ProductData) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      categoryId: data.categoryId,
      // ... other fields
    }
  })
  
  return product
}
```

### 4. API Route

```typescript
// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Process checkout
  
  return NextResponse.json({ success: true })
}
```

---

## 🔍 Finding Specific Features

### Authentication Flow

1. **Login Form:** `src/components/auth/LoginForm.tsx`
2. **Supabase Client:** `src/lib/supabase/client.ts`
3. **Middleware:** `middleware.ts` (session refresh)
4. **Protected Routes:** Check in `src/app/(admin)/layout.tsx`

### Shopping Cart Flow

1. **Cart Store:** `src/store/cart-store.ts` (state management)
2. **Add to Cart:** `src/components/product/AddToCartButton.tsx`
3. **Cart Page:** `src/app/(shop)/cart/page.tsx`
4. **Cart Icon:** `src/components/layout/Header.tsx` (line 167)

### Order Flow

1. **Checkout Page:** `src/app/(shop)/checkout/page.tsx`
2. **Order Action:** `src/app/actions/order.ts`
3. **Order Success:** `src/app/(shop)/checkout/success/page.tsx`
4. **Order History:** `src/app/(shop)/account/orders/page.tsx`

### Product Management

1. **Product List (Admin):** `src/app/(admin)/admin/products/page.tsx`
2. **Product Form:** `src/components/admin/products/ProductForm.tsx`
3. **Product Actions:** `src/app/actions/product.ts`
4. **Product Schema:** `prisma/schema.prisma` (line 49)

---

## 🎓 Learning Path

### For Beginners:

1. **Start with:** Homepage (`src/app/(shop)/page.tsx`)
2. **Then explore:** Components (`src/components/`)
3. **Understand:** Layout (`src/app/(shop)/layout.tsx`)
4. **Learn:** Database schema (`prisma/schema.prisma`)

### For Intermediate:

1. **Study:** Server Actions (`src/app/actions/`)
2. **Understand:** State Management (`src/store/`)
3. **Explore:** Authentication flow
4. **Learn:** API routes (`src/app/api/`)

### For Advanced:

1. **Optimize:** Database queries
2. **Implement:** Payment gateway
3. **Add:** Real-time features
4. **Deploy:** Production setup

---

## 📝 Code Conventions

### File Naming:
- **Components:** PascalCase (`ProductCard.tsx`)
- **Utilities:** camelCase (`utils.ts`)
- **Pages:** lowercase (`page.tsx`)
- **Actions:** lowercase (`product.ts`)

### Component Structure:
```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types
type Props = {
  title: string
}

// 3. Component
export function MyComponent({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState()
  
  // 5. Functions
  const handleClick = () => {}
  
  // 6. Render
  return <div>{title}</div>
}
```

### Database Queries:
```typescript
// Always use Prisma
const products = await prisma.product.findMany({
  where: { isActive: true },
  include: { 
    productImages: true,
    productWeights: true 
  },
  orderBy: { createdAt: 'desc' }
})
```

---

## 🐛 Debugging Tips

### Find where a feature is used:
```bash
# Search for text
grep -r "Add to Cart" src/

# Search for component
grep -r "ProductCard" src/

# Search for function
grep -r "addItem" src/
```

### Check database:
```bash
# Open Prisma Studio
npx prisma studio

# View specific table
# Click on table name in sidebar
```

### Check logs:
- **Browser Console:** F12 → Console
- **Server Logs:** Terminal where `npm run dev` is running
- **Network Tab:** F12 → Network (for API calls)

---

## 🎯 Quick Tasks

### Add a new page:
1. Create file: `src/app/(shop)/new-page/page.tsx`
2. Add content
3. Link to it: `<Link href="/new-page">New Page</Link>`

### Add a new component:
1. Create file: `src/components/MyComponent.tsx`
2. Export component
3. Import where needed: `import { MyComponent } from '@/components/MyComponent'`

### Add a new database table:
1. Edit: `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name add_table_name`
3. Use in code: `await prisma.tableName.findMany()`

### Add a new server action:
1. Create/edit file in: `src/app/actions/`
2. Add `'use server'` at top
3. Export async function
4. Call from client: `import { myAction } from '@/app/actions/myfile'`

---

**Happy Coding! 🚀**

Remember: When in doubt, search the codebase or check the documentation files!
