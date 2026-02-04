# 🥩 MeatKart - Application Overview

## What is MeatKart?

MeatKart is a **full-stack e-commerce web application** designed for selling premium meat products online in Hyderabad, India. It provides a complete online shopping experience for customers and a comprehensive management system for administrators.

---

## 🎯 Business Purpose

- **Target Market:** Hyderabad meat consumers
- **Product Categories:** Mutton, Chicken, Seafood, Ready-to-Cook, Eggs, Cold Cuts
- **Unique Features:**
  - Multiple weight options per product (250g, 500g, 1kg, etc.)
  - Different cut types (Curry cut, Boneless, etc.)
  - Halal certified products
  - Same-day delivery with time slots
  - Premium quality assurance

---

## 🏗️ Architecture

### Frontend
- **Framework:** Next.js 15.5.9 with App Router
- **Rendering:** Server-Side Rendering (SSR) + Client Components
- **Styling:** Tailwind CSS + Custom CSS (Bootstrap 3 based)
- **State Management:** Zustand for cart and location
- **UI Components:** Radix UI primitives

### Backend
- **API:** Next.js Server Actions + API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Supabase Auth
- **File Storage:** Local (public folder) + Supabase (optional)

### Deployment
- **Platform:** Vercel (configured) or AWS EC2 (scripts included)
- **Database:** Supabase PostgreSQL or self-hosted
- **Domain:** Custom domain support with SSL

---

## 📱 User Flows

### Customer Journey

1. **Browse Products**
   - View homepage with featured products
   - Browse by category (Mutton, Chicken, Seafood)
   - Search for specific products

2. **Product Selection**
   - View product details
   - Select weight option (affects price)
   - Choose cut type
   - Add to cart

3. **Shopping Cart**
   - View cart items
   - Update quantities
   - Remove items
   - See total price

4. **Checkout**
   - Login/Signup (if not logged in)
   - Select delivery address (or add new)
   - Choose delivery time slot
   - Select payment method (COD/Online)
   - Place order

5. **Order Management**
   - View order history
   - Track order status
   - Download invoice
   - Request refund (to wallet)

6. **Account Management**
   - Manage addresses
   - View wallet balance
   - Update profile
   - Set notification preferences

### Admin Journey

1. **Dashboard**
   - View revenue statistics
   - Monitor order counts
   - Track active users
   - See recent sales

2. **Product Management**
   - Add new products
   - Edit product details
   - Manage product images
   - Set multiple weight options with prices
   - Activate/deactivate products

3. **Category Management**
   - Create categories
   - Edit category details
   - Set display order
   - Upload category images

4. **Order Management**
   - View all orders
   - Filter by status
   - Update order status
   - Assign delivery person
   - Process refunds

5. **User Management**
   - View customer list
   - View order history per user
   - Manage user roles

---

## 🗄️ Database Schema

### Core Entities

#### Users
- Customer and admin accounts
- Phone-based authentication
- Role-based access (customer/admin)

#### Products
- Product information
- Multiple images per product
- Multiple weight options with different prices
- Stock management
- Freshness tracking

#### Categories
- Product categorization
- Display ordering
- Category images

#### Orders
- Order tracking
- Payment status
- Delivery status
- Order items with quantities

#### Cart
- Persistent cart (stored in database)
- Client-side cart (Zustand for immediate updates)

#### Addresses
- Multiple addresses per user
- Default address selection

#### Wallet
- Store credit system
- Transaction history
- Refund management

---

## 🔐 Authentication & Authorization

### Authentication (Supabase)
- Phone/Email based signup
- Email verification
- Password reset
- Session management
- JWT tokens

### Authorization
- **Customer Role:** Can browse, shop, place orders
- **Admin Role:** Full access to admin panel
- Route protection via middleware
- Server-side permission checks

---

## 💳 Payment Integration

Currently supports:
- **Cash on Delivery (COD)** - Fully implemented
- **Online Payment** - Ready for integration
  - Razorpay (recommended for India)
  - Stripe (international)
  - PayPal

Payment flow:
1. Customer selects payment method
2. Order created with "pending" status
3. Payment processed
4. Order status updated to "confirmed"
5. Payment record created

---

## 📦 Key Features Breakdown

### 1. Shopping Cart
- **Location:** Client-side (Zustand) + Server-side (Database)
- **Persistence:** LocalStorage + Database sync
- **Features:**
  - Add/remove items
  - Update quantities
  - Calculate totals
  - Apply discounts
  - Weight-based pricing

### 2. Product Management
- **Multiple Images:** Primary image + gallery
- **Weight Variants:** Different prices for different weights
- **Cut Types:** Curry cut, Boneless, etc.
- **Stock Tracking:** Real-time inventory
- **Freshness Date:** Display freshness information

### 3. Order Management
- **Order Lifecycle:**
  - Pending → Confirmed → Processing → Out for Delivery → Delivered
- **Order Number:** Auto-generated unique identifier
- **Invoice Generation:** Printable invoices
- **Delivery Slots:** Morning, Afternoon, Evening
- **Status Tracking:** Real-time updates

### 4. Address Management
- **Multiple Addresses:** Save multiple delivery locations
- **Address Types:** Home, Office, Other
- **Default Address:** Quick checkout
- **Validation:** Pincode verification

### 5. Wallet System
- **Balance Tracking:** Store credits
- **Transactions:** Credit/Debit history
- **Refunds:** Automatic wallet credit
- **Usage:** Apply wallet balance at checkout

---

## 🎨 UI/UX Design

### Desktop Layout
- **Header:**
  - Logo
  - Location selector
  - Phone number
  - Login/Account link
  - Navigation menu
  - Search bar
  - Shopping cart indicator

- **Main Content:**
  - Category cards
  - Product listings
  - Promotional banners
  - Best sellers section

- **Footer:**
  - Contact information
  - Social media links
  - Quick links
  - Certifications

### Mobile Layout
- **Fixed Top Header:**
  - Logo
  - Search icon
  - Cart icon

- **Bottom Navigation:**
  - Home
  - Categories
  - Cart
  - Account

- **Responsive Design:**
  - Touch-friendly buttons
  - Optimized images
  - Mobile-first approach

---

## 🔧 Technical Implementation

### Server Actions
Located in `src/app/actions/`:
- `user.ts` - User CRUD operations
- `product.ts` - Product operations
- `category.ts` - Category operations
- `order.ts` - Order processing

### API Routes
Located in `src/app/api/`:
- `/api/checkout` - Checkout processing
- `/api/health` - Health check endpoint

### State Management
- **Cart Store** (`cart-store.ts`):
  - Items array
  - Add/remove/update methods
  - Total calculation
  - LocalStorage persistence

- **Location Store** (`location-store.ts`):
  - Current city
  - City selection

### Middleware
- **Auth Middleware** (`middleware.ts`):
  - Session refresh
  - Protected routes
  - Role verification

---

## 📊 Admin Dashboard

### Statistics Cards
- Total Revenue (with trend)
- Order Count (with growth %)
- Product Count
- Active Users

### Charts (Placeholder)
- Revenue Overview
- Sales Analytics
- Category Performance

### Recent Activity
- Latest orders
- Recent signups
- Product updates

---

## 🚀 Performance Optimizations

1. **Server-Side Rendering:**
   - Fast initial page load
   - SEO-friendly

2. **Image Optimization:**
   - Next.js Image component
   - Lazy loading
   - Responsive images

3. **Database Optimization:**
   - Indexed queries
   - Efficient joins
   - Connection pooling

4. **Caching:**
   - Static page generation
   - API response caching
   - Browser caching

5. **Code Splitting:**
   - Dynamic imports
   - Route-based splitting
   - Component lazy loading

---

## 🔒 Security Features

1. **Authentication:**
   - Secure password hashing (Supabase)
   - JWT token validation
   - Session management

2. **Authorization:**
   - Role-based access control
   - Server-side permission checks
   - Protected API routes

3. **Data Validation:**
   - Zod schema validation
   - Input sanitization
   - SQL injection prevention (Prisma)

4. **HTTPS:**
   - SSL certificate support
   - Secure cookie flags
   - CORS configuration

---

## 📱 Mobile Responsiveness

- **Breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

- **Mobile Features:**
  - Touch gestures
  - Bottom navigation
  - Swipeable carousels
  - Optimized forms

---

## 🌐 SEO Optimization

- **Meta Tags:**
  - Title, description, keywords
  - Open Graph tags
  - Twitter cards

- **Structured Data:**
  - Product schema
  - Organization schema
  - Breadcrumbs

- **Sitemap:**
  - Dynamic sitemap generation
  - Product URLs
  - Category URLs

---

## 📈 Analytics Ready

Integration points for:
- Google Analytics
- Facebook Pixel
- Conversion tracking
- User behavior tracking

---

## 🔄 Future Enhancements

### Planned Features:
1. **Wishlist:** Save favorite products
2. **Product Reviews:** Customer ratings and reviews
3. **Loyalty Program:** Points and rewards
4. **Referral System:** Invite friends
5. **Push Notifications:** Order updates
6. **Live Chat:** Customer support
7. **Recipe Section:** Cooking guides
8. **Subscription Plans:** Regular deliveries
9. **Gift Cards:** Purchase and redeem
10. **Multi-language:** Hindi, Telugu support

### Technical Improvements:
1. **Real-time Updates:** WebSocket for order tracking
2. **Progressive Web App:** Offline support
3. **Advanced Analytics:** Custom dashboards
4. **A/B Testing:** Feature experimentation
5. **Performance Monitoring:** Error tracking
6. **Automated Testing:** Unit and E2E tests

---

## 📞 Support & Maintenance

### Monitoring:
- Health check endpoint
- Error logging
- Performance metrics
- Database monitoring

### Backups:
- Daily database backups
- Image backups
- Configuration backups

### Updates:
- Dependency updates
- Security patches
- Feature releases

---

## 📚 Technology Choices Explained

### Why Next.js?
- Server-side rendering for SEO
- API routes for backend
- File-based routing
- Image optimization
- Great developer experience

### Why Prisma?
- Type-safe database queries
- Auto-generated types
- Migration management
- Database introspection
- Multi-database support

### Why Supabase?
- Easy authentication setup
- Real-time capabilities
- PostgreSQL database
- File storage
- Free tier available

### Why Zustand?
- Simple state management
- No boilerplate
- TypeScript support
- Persistence middleware
- Small bundle size

---

## 🎓 Learning Resources

To understand this codebase better:

1. **Next.js App Router:**
   - https://nextjs.org/docs/app

2. **Prisma:**
   - https://www.prisma.io/docs

3. **Supabase Auth:**
   - https://supabase.com/docs/guides/auth

4. **Zustand:**
   - https://github.com/pmndrs/zustand

5. **Tailwind CSS:**
   - https://tailwindcss.com/docs

---

## 📝 Code Quality

- **TypeScript:** Full type safety
- **ESLint:** Code linting
- **Prettier:** Code formatting (can be added)
- **Git Hooks:** Pre-commit checks (can be added)

---

## 🤝 Contributing

To contribute to this project:

1. Understand the architecture
2. Follow the existing code style
3. Write clear commit messages
4. Test your changes
5. Update documentation

---

**This application is production-ready with proper setup and configuration!** 🚀
