# 🥩 MeatKart - START HERE

Welcome! This document will guide you through understanding and running this application locally.

---

## 📚 Documentation Index

I've created comprehensive documentation for you. Read them in this order:

### 1️⃣ **APP_OVERVIEW.md** - Understand What This Is
- What is MeatKart?
- Business purpose and features
- Architecture overview
- User flows
- Database schema
- Technology stack explained

👉 **Start here to understand the application**

### 2️⃣ **INSTALL_GUIDE.md** - Set Up Your Environment
- Prerequisites (Node.js, PostgreSQL)
- Step-by-step installation
- Database setup
- Supabase configuration
- Environment variables
- Running the app

👉 **Follow this to get the app running**

### 3️⃣ **CODE_GUIDE.md** - Navigate the Codebase
- File structure explained
- Where to find specific features
- Common code patterns
- Quick reference guide
- Debugging tips

👉 **Use this when working with the code**

### 4️⃣ **SETUP_LOCAL.md** - Quick Reference
- Condensed setup instructions
- Common issues and solutions
- Available scripts
- Default routes

👉 **Keep this handy for quick reference**

---

## ⚡ Quick Start (TL;DR)

If you just want to get started quickly:

### Prerequisites Check:
```bash
# Check if Node.js is installed
node --version
# If not installed: brew install node@20

# Check if PostgreSQL is installed
psql --version
# If not installed: brew install postgresql@14
```

### Run the Quick Start Script:
```bash
# Make it executable
chmod +x quick-start.sh

# Run it
./quick-start.sh
```

The script will:
- ✅ Check prerequisites
- ✅ Create `.env.local` template
- ✅ Install dependencies
- ✅ Set up Prisma
- ✅ Guide you through database setup
- ✅ Optionally start the dev server

---

## 🎯 What You Need to Know

### This is a **Next.js E-commerce Application** for selling meat products

**Tech Stack:**
- **Frontend:** Next.js 15 + React 19
- **Backend:** Next.js Server Actions + API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Supabase
- **Styling:** Tailwind CSS + Custom CSS

**Main Features:**
- 🛒 Shopping cart
- 👤 User authentication
- 📦 Order management
- 💳 Multiple payment options
- 📱 Mobile responsive
- 🔐 Admin dashboard

---

## 📋 Setup Checklist

Before you can run the app, you need:

- [ ] **Node.js v20+** installed
- [ ] **PostgreSQL** installed and running
- [ ] **Supabase account** created (free)
- [ ] **`.env.local`** file configured
- [ ] **Dependencies** installed (`npm install`)
- [ ] **Database** created and migrated
- [ ] **Admin user** created

**Detailed instructions:** See `INSTALL_GUIDE.md`

---

## 🚀 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local` with:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/meatkart"
DIRECT_URL="postgresql://postgres:password@localhost:5432/meatkart"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_key"
NODE_ENV="development"
```

### 3. Set Up Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
```
http://localhost:3000
```

---

## 🗺️ Key Locations

### Customer Pages:
- **Homepage:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login
- **Cart:** http://localhost:3000/cart
- **Checkout:** http://localhost:3000/checkout
- **Account:** http://localhost:3000/account

### Admin Pages:
- **Dashboard:** http://localhost:3000/admin
- **Products:** http://localhost:3000/admin/products
- **Categories:** http://localhost:3000/admin/categories
- **Orders:** http://localhost:3000/admin/orders

### Database:
- **Prisma Studio:** http://localhost:5555 (run `npx prisma studio`)

---

## 📁 Project Structure (Simplified)

```
meatkart/
├── src/
│   ├── app/
│   │   ├── (shop)/          # Customer-facing pages
│   │   ├── (admin)/         # Admin dashboard
│   │   ├── actions/         # Backend logic (Server Actions)
│   │   └── api/             # API endpoints
│   ├── components/          # React components
│   ├── lib/                 # Utilities (Prisma, Supabase)
│   └── store/               # State management (Zustand)
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static files (images, CSS)
└── [config files]           # next.config.ts, etc.
```

**Detailed structure:** See `CODE_GUIDE.md`

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma Client

# Utilities
npm run lint             # Run linter
```

---

## 🐛 Troubleshooting

### "Node.js not found"
```bash
# Install Node.js
brew install node@20
```

### "Can't connect to database"
```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql@14

# Create database
psql -U postgres -c "CREATE DATABASE meatkart;"
```

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Port 3000 in use"
```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)
```

**More solutions:** See `INSTALL_GUIDE.md` → Troubleshooting section

---

## 🎓 Learning Path

### Day 1: Understanding
1. Read `APP_OVERVIEW.md`
2. Explore the homepage code: `src/app/(shop)/page.tsx`
3. Look at a component: `src/components/product/ProductCard.tsx`
4. Check database schema: `prisma/schema.prisma`

### Day 2: Setup
1. Follow `INSTALL_GUIDE.md`
2. Install prerequisites
3. Set up database
4. Configure Supabase
5. Run the app

### Day 3: Exploring
1. Use `CODE_GUIDE.md` as reference
2. Browse different pages
3. Add a product via admin panel
4. Place a test order
5. Explore Prisma Studio

### Day 4+: Development
1. Make small changes
2. Add new features
3. Customize styling
4. Deploy to production

---

## 📊 Database Tables

The app uses these main tables:

- **users** - Customers and admins
- **categories** - Product categories
- **products** - Product listings
- **product_weights** - Different weight options
- **cart_items** - Shopping cart
- **orders** - Customer orders
- **addresses** - Delivery addresses
- **payments** - Payment records
- **wallets** - Customer credits

**Full schema:** `prisma/schema.prisma`

---

## 🔐 Creating an Admin User

You need an admin user to access the admin panel:

**Option 1: Prisma Studio (Easiest)**
```bash
npx prisma studio
# Open http://localhost:5555
# Go to 'users' table
# Add a user with role='admin'
```

**Option 2: SQL**
```bash
psql -U postgres -d meatkart
# Run:
INSERT INTO users (phone, email, name, role) 
VALUES ('9876543210', 'admin@meatkart.com', 'Admin', 'admin');
```

---

## 🌟 Key Features to Explore

### Customer Features:
1. **Browse Products** - Homepage and category pages
2. **Add to Cart** - Click "Add to Cart" on any product
3. **Checkout** - Complete an order
4. **Account** - View orders, manage addresses
5. **Search** - Search for products

### Admin Features:
1. **Dashboard** - View statistics
2. **Products** - Add/edit products
3. **Categories** - Manage categories
4. **Orders** - View and update orders
5. **Users** - View customer list

---

## 💡 Tips

1. **Use Prisma Studio** - It's the easiest way to view/edit database
2. **Check Console** - Browser console shows errors
3. **Read Logs** - Terminal shows server-side errors
4. **Use Search** - Search codebase with `grep` or VS Code search
5. **Follow Patterns** - Look at existing code for examples

---

## 📞 Need Help?

### Check These First:
1. **Console Errors** - Browser F12 → Console
2. **Server Logs** - Terminal where `npm run dev` runs
3. **Database** - `npx prisma studio` to inspect data
4. **Environment** - Verify `.env.local` is correct

### Common Issues:
- **Can't connect to DB** → Check PostgreSQL is running
- **Module not found** → Run `npm install`
- **Prisma errors** → Run `npx prisma generate`
- **Auth not working** → Check Supabase credentials

---

## 🚀 Next Steps

1. **Get it running locally** (follow `INSTALL_GUIDE.md`)
2. **Explore the code** (use `CODE_GUIDE.md`)
3. **Make changes** (start small)
4. **Deploy** (see `DEPLOY.md`)

---

## 📚 Additional Documentation

- **DEPLOY.md** - Deployment instructions
- **MANUAL_DEPLOY.md** - Manual deployment guide
- **DOMAIN_SSL_SETUP.md** - Domain and SSL setup
- **README.md** - Original Next.js README

---

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Understand the application
- ✅ Set it up locally
- ✅ Navigate the codebase
- ✅ Start developing

**Start with:** `INSTALL_GUIDE.md` to get the app running!

---

## 📝 Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│  MeatKart - Quick Reference                     │
├─────────────────────────────────────────────────┤
│  Start dev server:    npm run dev               │
│  Open app:            http://localhost:3000     │
│  Open DB GUI:         npx prisma studio         │
│  View docs:           See documentation files   │
├─────────────────────────────────────────────────┤
│  Customer pages:      /                         │
│                       /cart                     │
│                       /checkout                 │
│                       /account                  │
│  Admin pages:         /admin                    │
│                       /admin/products           │
│                       /admin/orders             │
├─────────────────────────────────────────────────┤
│  Code locations:                                │
│  - Pages:             src/app/                  │
│  - Components:        src/components/           │
│  - Backend logic:     src/app/actions/          │
│  - Database schema:   prisma/schema.prisma      │
└─────────────────────────────────────────────────┘
```

---

**Happy Coding! 🚀**

*If you're stuck, check the documentation files or search the codebase!*
