# ✅ MeatKart Setup Checklist

Use this checklist to track your progress in setting up MeatKart locally.

---

## 📋 Phase 1: Understanding (15 minutes)

- [ ] Read `START_HERE.md`
- [ ] Understand what MeatKart is
- [ ] Review the tech stack
- [ ] Check the project structure
- [ ] Understand the key features

**Status:** ⬜ Not Started | 🔄 In Progress | ✅ Complete

---

## 📋 Phase 2: Prerequisites (30-60 minutes)

### Node.js Installation

- [ ] Check if Node.js is installed: `node --version`
- [ ] If not installed, install Node.js v20+
  - [ ] macOS: `brew install node@20`
  - [ ] Or download from: https://nodejs.org/
- [ ] Verify installation: `node --version` (should show v20.x.x)
- [ ] Verify npm: `npm --version` (should show 10.x.x)

**Node.js Status:** ⬜ Not Installed | ✅ Installed

### PostgreSQL Installation

- [ ] Check if PostgreSQL is installed: `psql --version`
- [ ] If not installed, install PostgreSQL 14+
  - [ ] macOS: `brew install postgresql@14`
  - [ ] Or download from: https://www.postgresql.org/download/
- [ ] Start PostgreSQL service
  - [ ] macOS: `brew services start postgresql@14`
  - [ ] Or Docker: `docker run --name meatkart-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=meatkart -p 5432:5432 -d postgres:14`
- [ ] Verify it's running: `psql --version`

**PostgreSQL Status:** ⬜ Not Installed | ✅ Installed & Running

### Create Database

- [ ] Connect to PostgreSQL: `psql -U postgres`
- [ ] Create database: `CREATE DATABASE meatkart;`
- [ ] Verify: `\l` (should see meatkart in list)
- [ ] Exit: `\q`

**Database Status:** ⬜ Not Created | ✅ Created

---

## 📋 Phase 3: Supabase Setup (15 minutes)

### Create Supabase Account

- [ ] Go to https://supabase.com
- [ ] Sign up for free account
- [ ] Verify email address

**Supabase Account:** ⬜ Not Created | ✅ Created

### Create Supabase Project

- [ ] Click "New Project"
- [ ] Project name: `meatkart`
- [ ] Database password: (choose strong password)
- [ ] Region: (choose closest to you)
- [ ] Wait for project creation (~2 minutes)

**Supabase Project:** ⬜ Not Created | ✅ Created

### Get API Credentials

- [ ] Go to Settings → API
- [ ] Copy Project URL (e.g., `https://xxxxx.supabase.co`)
- [ ] Copy anon/public key (starts with `eyJ...`)
- [ ] Save these for later

**API Credentials:** ⬜ Not Copied | ✅ Copied

### Configure Authentication

- [ ] Go to Authentication → Providers
- [ ] Enable Email provider
- [ ] (Optional) Enable other providers (Google, GitHub, etc.)

**Auth Configured:** ⬜ Not Done | ✅ Done

---

## 📋 Phase 4: Project Setup (15 minutes)

### Install Dependencies

- [ ] Navigate to project: `cd /Users/boddu/Documents/Webenrich/meatkart`
- [ ] Install dependencies: `npm install`
- [ ] Wait for installation to complete
- [ ] Verify `node_modules/` folder exists

**Dependencies:** ⬜ Not Installed | ✅ Installed

### Configure Environment Variables

- [ ] Create `.env.local` file in project root
- [ ] Add DATABASE_URL (your PostgreSQL connection string)
- [ ] Add DIRECT_URL (same as DATABASE_URL)
- [ ] Add NEXT_PUBLIC_SUPABASE_URL (from Supabase)
- [ ] Add NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase)
- [ ] Add NODE_ENV="development"
- [ ] Save file

**Environment Variables:** ⬜ Not Configured | ✅ Configured

**Example `.env.local`:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/meatkart"
DIRECT_URL="postgresql://postgres:password@localhost:5432/meatkart"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
NODE_ENV="development"
```

---

## 📋 Phase 5: Database Setup (10 minutes)

### Generate Prisma Client

- [ ] Run: `npx prisma generate`
- [ ] Wait for completion
- [ ] Should see "Generated Prisma Client"

**Prisma Client:** ⬜ Not Generated | ✅ Generated

### Run Migrations

- [ ] Run: `npx prisma migrate dev`
- [ ] Enter migration name (or press Enter for default)
- [ ] Wait for migrations to complete
- [ ] Should see "Your database is now in sync with your schema"

**Migrations:** ⬜ Not Run | ✅ Run

### Seed Database (Optional but Recommended)

- [ ] Run: `npx prisma db seed`
- [ ] Wait for seeding to complete
- [ ] Should see sample categories and products created

**Database Seeded:** ⬜ Not Done | ⏭️ Skipped | ✅ Done

---

## 📋 Phase 6: Create Admin User (5 minutes)

Choose one method:

### Option A: Prisma Studio (Recommended)

- [ ] Run: `npx prisma studio`
- [ ] Open: http://localhost:5555
- [ ] Click on "users" table
- [ ] Click "Add record"
- [ ] Fill in:
  - [ ] phone: "9876543210"
  - [ ] email: "admin@meatkart.com"
  - [ ] name: "Admin User"
  - [ ] role: "admin" ⚠️ Important!
- [ ] Click "Save 1 change"

### Option B: SQL

- [ ] Run: `psql -U postgres -d meatkart`
- [ ] Execute:
  ```sql
  INSERT INTO users (phone, email, name, role) 
  VALUES ('9876543210', 'admin@meatkart.com', 'Admin User', 'admin');
  ```
- [ ] Exit: `\q`

**Admin User:** ⬜ Not Created | ✅ Created

---

## 📋 Phase 7: Start Application (5 minutes)

### Start Development Server

- [ ] Run: `npm run dev`
- [ ] Wait for server to start
- [ ] Should see: "ready started server on 0.0.0.0:3000"
- [ ] No errors in terminal

**Dev Server:** ⬜ Not Started | ✅ Running

### Test Application

- [ ] Open browser: http://localhost:3000
- [ ] Homepage loads successfully
- [ ] Images are visible
- [ ] Navigation works
- [ ] No console errors (F12 → Console)

**Homepage:** ⬜ Not Loading | ✅ Working

### Test Authentication

- [ ] Go to: http://localhost:3000/auth/login
- [ ] Try to sign up with test account
- [ ] Verify email (check inbox)
- [ ] Log in successfully
- [ ] Redirected to account page

**Authentication:** ⬜ Not Working | ✅ Working

### Test Admin Panel

- [ ] Log out if logged in as customer
- [ ] Log in with admin credentials (phone: 9876543210)
- [ ] Go to: http://localhost:3000/admin
- [ ] Dashboard loads successfully
- [ ] Can access Products, Categories, Orders pages

**Admin Panel:** ⬜ Not Working | ✅ Working

### Test Shopping Flow

- [ ] Browse products on homepage
- [ ] Click on a product
- [ ] Select weight option
- [ ] Click "Add to Cart"
- [ ] View cart (should show 1 item)
- [ ] Update quantity
- [ ] Remove item
- [ ] Cart updates correctly

**Shopping Cart:** ⬜ Not Working | ✅ Working

---

## 📋 Phase 8: Verification (10 minutes)

### Database Verification

- [ ] Run: `npx prisma studio`
- [ ] Open: http://localhost:5555
- [ ] Check tables exist:
  - [ ] users
  - [ ] categories
  - [ ] products
  - [ ] orders
  - [ ] cart_items
  - [ ] addresses
- [ ] Check data exists (if seeded)

**Database:** ⬜ Issues Found | ✅ All Good

### Feature Testing

- [ ] Search functionality works
- [ ] Category pages load
- [ ] Product details page works
- [ ] Cart persists on page reload
- [ ] Checkout page accessible
- [ ] Account pages work
- [ ] Admin CRUD operations work

**Features:** ⬜ Issues Found | ✅ All Working

### Performance Check

- [ ] Pages load quickly (< 2 seconds)
- [ ] No console errors
- [ ] No console warnings (or acceptable)
- [ ] Images load properly
- [ ] Responsive on mobile (test with browser DevTools)

**Performance:** ⬜ Issues Found | ✅ Good

---

## 📋 Phase 9: Learning (Ongoing)

### Code Exploration

- [ ] Read `CODE_GUIDE.md`
- [ ] Explore homepage code: `src/app/(shop)/page.tsx`
- [ ] Look at a component: `src/components/product/ProductCard.tsx`
- [ ] Check server action: `src/app/actions/product.ts`
- [ ] Review database schema: `prisma/schema.prisma`

**Code Understanding:** ⬜ Not Started | 🔄 In Progress | ✅ Good Understanding

### Documentation Review

- [ ] Read `APP_OVERVIEW.md`
- [ ] Read `ARCHITECTURE_DIAGRAM.md`
- [ ] Bookmark `CODE_GUIDE.md` for reference
- [ ] Keep `INSTALL_GUIDE.md` handy for troubleshooting

**Documentation:** ⬜ Not Read | ✅ Read

---

## 📋 Phase 10: Customization (Optional)

### Branding

- [ ] Update logo: Replace `/public/images/logo.png`
- [ ] Update favicon: Replace `/public/favicon.ico`
- [ ] Update site title: Edit `src/app/(shop)/layout.tsx`
- [ ] Update colors: Edit `tailwind.config.js` or CSS files

**Branding:** ⬜ Not Done | ⏭️ Skipped | ✅ Done

### Content

- [ ] Add real product data via admin panel
- [ ] Update category descriptions
- [ ] Add product images
- [ ] Update homepage content
- [ ] Update footer information

**Content:** ⬜ Not Done | ⏭️ Skipped | ✅ Done

### Configuration

- [ ] Update phone number in header
- [ ] Update delivery locations
- [ ] Configure payment methods
- [ ] Set up email notifications
- [ ] Configure delivery slots

**Configuration:** ⬜ Not Done | ⏭️ Skipped | ✅ Done

---

## 🎯 Overall Progress

```
┌─────────────────────────────────────────┐
│  Phase 1: Understanding        [ ]      │
│  Phase 2: Prerequisites        [ ]      │
│  Phase 3: Supabase Setup       [ ]      │
│  Phase 4: Project Setup        [ ]      │
│  Phase 5: Database Setup       [ ]      │
│  Phase 6: Create Admin User    [ ]      │
│  Phase 7: Start Application    [ ]      │
│  Phase 8: Verification         [ ]      │
│  Phase 9: Learning             [ ]      │
│  Phase 10: Customization       [ ]      │
├─────────────────────────────────────────┤
│  Overall Progress:         0%           │
└─────────────────────────────────────────┘
```

**Update this as you complete each phase!**

---

## 🆘 Troubleshooting Checklist

If something isn't working, check these:

### General Issues

- [ ] Node.js is installed and version is v20+
- [ ] PostgreSQL is running
- [ ] Database `meatkart` exists
- [ ] `.env.local` file exists and has correct values
- [ ] Dependencies are installed (`node_modules/` exists)
- [ ] Prisma Client is generated
- [ ] Migrations have been run
- [ ] No errors in terminal
- [ ] No errors in browser console

### Database Connection Issues

- [ ] PostgreSQL service is running
- [ ] DATABASE_URL is correct
- [ ] Database name is correct
- [ ] Username and password are correct
- [ ] Port 5432 is not blocked

### Authentication Issues

- [ ] Supabase project is active
- [ ] NEXT_PUBLIC_SUPABASE_URL is correct
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- [ ] Email provider is enabled in Supabase
- [ ] No typos in environment variables

### Application Issues

- [ ] Port 3000 is not in use by another app
- [ ] All dependencies are installed
- [ ] Prisma Client is generated
- [ ] No TypeScript errors
- [ ] Images exist in `/public/images/`

---

## 📊 Success Criteria

You've successfully set up MeatKart when:

✅ Development server runs without errors  
✅ Homepage loads and displays correctly  
✅ You can browse products  
✅ You can add items to cart  
✅ Cart persists on page reload  
✅ You can sign up/login  
✅ Admin panel is accessible  
✅ You can add products via admin panel  
✅ Database contains data  
✅ No critical errors in console  

---

## 🎉 Completion

When all phases are complete:

- [ ] All checkboxes above are checked ✅
- [ ] Application runs smoothly
- [ ] You understand the codebase structure
- [ ] You can make basic modifications
- [ ] You're ready to develop features

**Congratulations! You're ready to work with MeatKart!** 🚀

---

## 📝 Notes Section

Use this space to track any issues, solutions, or notes:

```
Date: ___________

Issues encountered:
-
-
-

Solutions applied:
-
-
-

Custom configurations:
-
-
-

Next steps:
-
-
-
```

---

**Keep this checklist handy and mark items as you complete them!**

**For detailed help on any step, refer to `INSTALL_GUIDE.md`**
