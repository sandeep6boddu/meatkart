# MeatKart - Local Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v20 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

#### Option A: Using Local PostgreSQL

1. Start PostgreSQL service
2. Create a new database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE meatkart;

# Exit psql
\q
```

#### Option B: Using Docker (Alternative)

```bash
docker run --name meatkart-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=meatkart \
  -p 5432:5432 \
  -d postgres:14
```

### 3. Set Up Supabase (for Authentication)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Get your project credentials:
   - Go to **Settings** → **API**
   - Copy the **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy the **anon/public key**

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and update the values:

```env
# Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/meatkart"
DIRECT_URL="postgresql://postgres:password@localhost:5432/meatkart"

# Update with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_actual_anon_key"
```

### 5. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 📁 Project Structure

```
meatkart/
├── src/
│   ├── app/
│   │   ├── (admin)/         # Admin dashboard pages
│   │   ├── (shop)/          # Customer-facing shop pages
│   │   ├── actions/         # Server actions
│   │   └── api/             # API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configurations
│   └── store/               # Zustand state stores
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

## 🔧 Common Issues & Solutions

### Issue: "Error: P1001: Can't reach database server"

**Solution:** 
- Verify PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL credentials
- Ensure PostgreSQL is listening on port 5432

### Issue: "Module not found: Can't resolve '@prisma/client'"

**Solution:**
```bash
npx prisma generate
```

### Issue: Authentication not working

**Solution:**
- Verify Supabase credentials in `.env.local`
- Make sure the Supabase URL starts with `https://`
- Check that you're using the **anon/public** key, not the service role key

### Issue: Images not showing

**Solution:**
- Check that the `/public/images/` directory has all required images
- Verify image paths in the code

## 🗃️ Database Management

### View database in Prisma Studio

```bash
npx prisma studio
```

This opens a visual database browser at http://localhost:5555

### Reset database (⚠️ This deletes all data)

```bash
npx prisma migrate reset
```

## 👤 Create Admin User

After setting up, create an admin user:

```bash
npx ts-node prisma/create-user.ts
```

Or manually through Prisma Studio:
1. Run `npx prisma studio`
2. Open the `users` table
3. Add a new user with `role: "admin"`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Features

- 🛒 Shopping cart functionality
- 👤 User authentication (Supabase)
- 📦 Order management
- 💳 Multiple payment methods
- 📍 Address management
- 🔐 Admin dashboard
- 📱 Responsive design
- 🎯 Product categories (Meat, Chicken, Seafood)
- ⚖️ Multiple weight options per product
- 🏷️ Discount pricing

## 🔐 Default Routes

- **Shop:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login
- **Signup:** http://localhost:3000/auth/signup
- **Admin:** http://localhost:3000/admin (requires admin role)
- **Cart:** http://localhost:3000/cart
- **Account:** http://localhost:3000/account

## Need Help?

If you encounter any issues, check:
1. All dependencies are installed (`node_modules/` exists)
2. `.env.local` file exists and has correct values
3. PostgreSQL is running
4. Database migrations have been run
5. Prisma client has been generated

For more details, check the deployment guides:
- `DEPLOY.md`
- `MANUAL_DEPLOY.md`
- `DOMAIN_SSL_SETUP.md`
