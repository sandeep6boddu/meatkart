# 🥩 MeatKart - Complete Installation & Setup Guide

## 📋 Application Overview

**MeatKart** is a full-stack e-commerce platform for selling premium meat products online, built specifically for the Hyderabad market.

### 🎯 Key Features

#### Customer Features:
- 🛒 **Shopping Cart** - Add products with different weights and cut types
- 🔐 **User Authentication** - Supabase-powered login/signup
- 📦 **Order Management** - Place orders with delivery slots
- 📍 **Address Management** - Save multiple delivery addresses
- 💳 **Multiple Payment Options** - COD, Online payments
- 🔍 **Product Search** - Search by keywords
- 📱 **Mobile Responsive** - Works on all devices
- 🏷️ **Product Categories** - Mutton, Chicken, Seafood, Ready-to-Cook, Eggs, Cold Cuts
- ⚖️ **Multiple Weight Options** - Different pricing for different weights
- 💰 **Wallet System** - Store credits and refunds
- ❤️ **Wishlist** - Save favorite products

#### Admin Features:
- 📊 **Dashboard** - Revenue, orders, and user statistics
- 📦 **Product Management** - Add/edit/delete products
- 🏷️ **Category Management** - Manage product categories
- 📋 **Order Management** - View and update order status
- 👥 **User Management** - View customer details

### 🛠️ Technology Stack

- **Frontend:** Next.js 15.5.9 (App Router), React 19
- **Backend:** Next.js Server Actions & API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Supabase Auth
- **State Management:** Zustand (cart, location)
- **Styling:** Tailwind CSS + Custom CSS (Bootstrap 3 based)
- **UI Components:** Radix UI, Lucide Icons
- **Forms:** React Hook Form + Zod validation
- **Notifications:** Sonner (toast notifications)

---

## 🚀 Installation Steps

### Step 1: Install Node.js

You need Node.js v20 or higher installed on your system.

#### For macOS (using Homebrew):

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

#### Alternative: Using NVM (Node Version Manager):

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Close and reopen terminal, then:
nvm install 20
nvm use 20
nvm alias default 20
```

#### For Windows:
Download from [nodejs.org](https://nodejs.org/) and install the LTS version.

---

### Step 2: Install PostgreSQL

#### For macOS (using Homebrew):

```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify installation
psql --version
```

#### Alternative: Using Docker:

```bash
# Pull and run PostgreSQL container
docker run --name meatkart-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=meatkart \
  -p 5432:5432 \
  -d postgres:14

# Verify it's running
docker ps
```

#### For Windows:
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

---

### Step 3: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database (if not using Docker)
CREATE DATABASE meatkart;

# Verify
\l

# Exit
\q
```

---

### Step 4: Set Up Supabase (Authentication)

1. **Create Supabase Account:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account

2. **Create New Project:**
   - Click "New Project"
   - Name: `meatkart`
   - Database Password: (choose a strong password)
   - Region: Choose closest to you
   - Wait for project to be created (~2 minutes)

3. **Get API Credentials:**
   - Go to **Settings** → **API**
   - Copy the following:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon/public key** (starts with `eyJ...`)

4. **Configure Authentication:**
   - Go to **Authentication** → **Providers**
   - Enable **Email** provider
   - (Optional) Configure other providers like Google, GitHub

---

### Step 5: Install Project Dependencies

```bash
# Navigate to project directory
cd /Users/boddu/Documents/Webenrich/meatkart

# Install all dependencies
npm install

# This will install:
# - Next.js, React
# - Prisma, @prisma/client
# - Supabase client libraries
# - UI libraries (Radix, Tailwind)
# - And all other dependencies
```

---

### Step 6: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Create the file
touch .env.local

# Open in your editor
nano .env.local
# or
code .env.local
```

Add the following content (replace with your actual values):

```env
# Database Configuration
# Format: postgresql://username:password@host:port/database
DATABASE_URL="postgresql://postgres:password@localhost:5432/meatkart"
DIRECT_URL="postgresql://postgres:password@localhost:5432/meatkart"

# Supabase Configuration (from Step 4)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."

# Node Environment
NODE_ENV="development"
```

**Important Notes:**
- Replace `password` with your PostgreSQL password
- Replace the Supabase values with your actual credentials
- Never commit `.env.local` to git (it's already in .gitignore)

---

### Step 7: Set Up Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations (creates all tables)
npx prisma migrate dev --name init

# This creates the following tables:
# - users
# - categories
# - products
# - product_images
# - product_weights
# - cart_items
# - orders
# - order_items
# - addresses
# - payments
# - deliveries
# - wishlists
# - wishlist_items
# - wallets
# - wallet_transactions
# - notification_preferences
```

---

### Step 8: Seed Database (Optional but Recommended)

Create sample data for testing:

```bash
# Run the seed script
npx prisma db seed

# This will create:
# - Sample categories (Mutton, Chicken, Seafood)
# - Sample products with images and weights
# - Test admin user
```

---

### Step 9: Create Admin User

You need at least one admin user to access the admin dashboard.

**Option A: Using Prisma Studio (Easiest)**

```bash
# Open Prisma Studio
npx prisma studio

# This opens http://localhost:5555
# 1. Click on "users" table
# 2. Click "Add record"
# 3. Fill in:
#    - phone: "9876543210"
#    - email: "admin@meatkart.com"
#    - name: "Admin User"
#    - role: "admin" (important!)
# 4. Click "Save 1 change"
```

**Option B: Using SQL**

```bash
# Connect to database
psql -U postgres -d meatkart

# Insert admin user
INSERT INTO users (phone, email, name, role) 
VALUES ('9876543210', 'admin@meatkart.com', 'Admin User', 'admin');

# Exit
\q
```

**Option C: Using the create-user script**

```bash
# If the script exists
npx ts-node prisma/create-user.ts
```

---

### Step 10: Start Development Server

```bash
# Start the Next.js development server
npm run dev

# You should see:
# ▲ Next.js 15.5.9
# - Local:        http://localhost:3000
# - ready started server on 0.0.0.0:3000
```

---

## 🎉 Access the Application

### Customer-Facing Pages:
- **Homepage:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login
- **Signup:** http://localhost:3000/auth/signup
- **Cart:** http://localhost:3000/cart
- **Checkout:** http://localhost:3000/checkout
- **My Account:** http://localhost:3000/account
- **Categories:**
  - http://localhost:3000/category/mutton
  - http://localhost:3000/category/chicken
  - http://localhost:3000/category/seafood
- **Search:** http://localhost:3000/search?q=chicken

### Admin Pages:
- **Admin Dashboard:** http://localhost:3000/admin
- **Products:** http://localhost:3000/admin/products
- **Categories:** http://localhost:3000/admin/categories
- **Orders:** http://localhost:3000/admin/orders
- **Users:** http://localhost:3000/admin/users

---

## 🗂️ Project Structure

```
meatkart/
├── src/
│   ├── app/
│   │   ├── (admin)/              # Admin section (protected)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx      # Dashboard
│   │   │   │   ├── products/     # Product management
│   │   │   │   ├── categories/   # Category management
│   │   │   │   ├── orders/       # Order management
│   │   │   │   └── users/        # User management
│   │   │   └── layout.tsx        # Admin layout
│   │   │
│   │   ├── (shop)/               # Customer section
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── cart/             # Shopping cart
│   │   │   ├── checkout/         # Checkout process
│   │   │   ├── category/         # Category pages
│   │   │   ├── product/          # Product details
│   │   │   ├── account/          # User account pages
│   │   │   ├── auth/             # Login/Signup
│   │   │   └── layout.tsx        # Shop layout
│   │   │
│   │   ├── actions/              # Server Actions
│   │   │   ├── user.ts           # User operations
│   │   │   ├── product.ts        # Product operations
│   │   │   ├── category.ts       # Category operations
│   │   │   └── order.ts          # Order operations
│   │   │
│   │   ├── api/                  # API Routes
│   │   │   ├── checkout/         # Checkout API
│   │   │   └── health/           # Health check
│   │   │
│   │   └── globals.css           # Global styles
│   │
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx        # Desktop header
│   │   │   ├── MobileHeader.tsx  # Mobile header
│   │   │   ├── Footer.tsx        # Footer
│   │   │   └── MobileBottomNav.tsx
│   │   │
│   │   ├── product/              # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   └── AddToCartButton.tsx
│   │   │
│   │   ├── auth/                 # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   │
│   │   ├── admin/                # Admin components
│   │   └── ui/                   # Reusable UI components
│   │
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client
│   │   ├── supabase/             # Supabase clients
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── middleware.ts     # Auth middleware
│   │   └── utils.ts              # Utility functions
│   │
│   └── store/
│       ├── cart-store.ts         # Cart state (Zustand)
│       └── location-store.ts     # Location state
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data script
│
├── public/
│   ├── images/                   # Product images, UI assets
│   ├── css/                      # Legacy CSS files
│   └── fonts/                    # Web fonts
│
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 🔧 Useful Commands

### Development:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database:
```bash
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create new migration
npx prisma migrate reset       # Reset database (⚠️ deletes data)
npx prisma generate            # Generate Prisma Client
npx prisma db push             # Push schema without migration
npx prisma db seed             # Seed database
```

### Prisma Studio:
```bash
npx prisma studio
# Opens http://localhost:5555
# Visual database browser and editor
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npx prisma generate
```

### Issue: "Error: P1001: Can't reach database server"

**Possible causes:**
1. PostgreSQL is not running
2. Wrong credentials in `.env.local`
3. Database doesn't exist

**Solutions:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql
# or
docker ps | grep postgres

# Restart PostgreSQL
brew services restart postgresql@14
# or
docker restart meatkart-postgres

# Test connection
psql -U postgres -d meatkart
```

### Issue: "Supabase authentication not working"

**Check:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon/public** key (not service role)
3. Check Supabase project is active
4. Verify email provider is enabled in Supabase dashboard

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
npm run dev -- -p 3001
```

### Issue: Images not showing

**Check:**
1. Images exist in `/public/images/` directory
2. Image paths are correct (case-sensitive)
3. Clear Next.js cache: `rm -rf .next`

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Database Schema Overview

### Core Tables:

- **users** - Customer and admin accounts
- **categories** - Product categories (Mutton, Chicken, etc.)
- **products** - Product listings
- **product_images** - Product photos
- **product_weights** - Different weight options and prices
- **cart_items** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Items in each order
- **addresses** - Delivery addresses
- **payments** - Payment records
- **deliveries** - Delivery tracking
- **wishlists** - Customer wishlists
- **wallets** - Customer wallet balances
- **notification_preferences** - User notification settings

---

## 🔐 Security Notes

1. **Never commit `.env.local`** to version control
2. Use strong passwords for database and Supabase
3. Keep your Supabase **service role key** secret (not used in this app)
4. In production, use environment variables, not `.env.local`
5. Enable rate limiting for API routes in production
6. Use HTTPS in production

---

## 🚀 Next Steps

1. **Add Products:** Use admin panel or Prisma Studio
2. **Test Shopping Flow:** Add to cart, checkout, place order
3. **Customize:** Update branding, colors, images
4. **Configure Payment Gateway:** Integrate Razorpay/Stripe
5. **Set Up Email:** Configure email notifications
6. **Deploy:** See `DEPLOY.md` for deployment instructions

---

## 📝 Default Test Credentials

After seeding, you can use:

**Admin:**
- Phone: 9876543210
- (Create account via Supabase first, then update role to "admin")

**Customer:**
- Sign up via: http://localhost:3000/auth/signup

---

## 🆘 Need Help?

1. Check the console for error messages
2. Review the logs in terminal
3. Use Prisma Studio to inspect database
4. Check Supabase logs in dashboard
5. Verify all environment variables are set correctly

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Happy Coding! 🎉**
