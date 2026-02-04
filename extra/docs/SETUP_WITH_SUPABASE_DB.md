# 🚀 Run MeatKart with Supabase Database

Since you already have a Supabase database, setup is much simpler!

---

## ✅ What You Have:
- ✓ Supabase database
- ✓ Dependencies installed
- ✓ Prisma Client generated

## ❌ What You Need:
- ✗ Node.js (must install)
- ✗ Supabase credentials configured

---

## 📝 STEP 1: Install Node.js (5 minutes)

Open Terminal and run:

```bash
# Install Node.js
brew install node@20

# Verify installation
node --version
npm --version
```

Or download from: https://nodejs.org/ (get LTS version v20)

---

## 📝 STEP 2: Get Supabase Database Credentials (3 minutes)

### 2.1: Go to Your Supabase Project

1. Open https://app.supabase.com
2. Select your MeatKart project
3. Go to **Settings** (gear icon) → **Database**

### 2.2: Get Connection String

Scroll down to **Connection string** section and select **URI** tab.

You'll see something like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Copy this entire string!**

### 2.3: Get API Credentials

Go to **Settings** → **API** and copy:
- **Project URL** (e.g., `https://xxxxx.supabase.co`)
- **anon public** key (long string starting with `eyJ...`)

---

## 📝 STEP 3: Create .env.local File (2 minutes)

In Terminal, run:

```bash
cd /Users/boddu/Documents/Webenrich/meatkart

# Create .env.local file
cat > .env.local << 'EOF'
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Node Environment
NODE_ENV="development"
EOF
```

Now **edit** the `.env.local` file and replace:
- Both `DATABASE_URL` and `DIRECT_URL` with your Supabase connection string
- `NEXT_PUBLIC_SUPABASE_URL` with your Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon key

**Save the file!**

---

## 📝 STEP 4: Run Database Migrations (3 minutes)

```bash
cd /Users/boddu/Documents/Webenrich/meatkart

# This will create all tables in your Supabase database
npx prisma migrate deploy

# Or if that doesn't work:
npx prisma db push
```

This creates all the tables (users, products, orders, etc.) in your Supabase database.

---

## 📝 STEP 5: Seed Database (Optional - 2 minutes)

Add some sample data:

```bash
npx prisma db seed
```

This adds sample categories and products to test with.

---

## 📝 STEP 6: Create Admin User (2 minutes)

```bash
# Open Prisma Studio
npx prisma studio
```

This opens http://localhost:5555

1. Click on **users** table
2. Click **Add record**
3. Fill in:
   - **phone:** 9876543210
   - **email:** admin@meatkart.com
   - **name:** Admin User
   - **role:** admin ⚠️ **Important!**
4. Click **Save 1 change**

---

## 📝 STEP 7: Start the App! 🚀

```bash
cd /Users/boddu/Documents/Webenrich/meatkart

# Start development server
npm run dev
```

You should see:
```
▲ Next.js 15.5.9
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

---

## 📝 STEP 8: Open in Browser

Open: **http://localhost:3000**

You should see the MeatKart homepage! 🎉

---

## 🎯 Verify Everything Works

Test these pages:

- [ ] **Homepage:** http://localhost:3000
- [ ] **Products:** Click on any product
- [ ] **Add to Cart:** Add an item to cart
- [ ] **Cart:** http://localhost:3000/cart
- [ ] **Login:** http://localhost:3000/auth/login
- [ ] **Admin:** http://localhost:3000/admin

---

## 🐛 Troubleshooting

### "npm: command not found"
→ Node.js not installed. Go to Step 1.

### "Error: P1001: Can't reach database server"
→ Check your `.env.local`:
- Is the connection string correct?
- Did you replace `[YOUR-PASSWORD]` with actual password?
- Is your Supabase project active?

### "Authentication Error: Invalid Supabase URL"
→ Check `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` must start with `https://`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon** key, not service role key

### "Module not found"
```bash
npm install
npx prisma generate
```

### Port 3000 already in use
```bash
kill -9 $(lsof -ti:3000)
```

---

## 📊 Your Setup Summary

✅ Using Supabase hosted database (no local PostgreSQL needed!)  
✅ Using Supabase authentication  
✅ All data stored in Supabase  
✅ App runs locally but connects to Supabase  

**Benefits:**
- No need to manage local PostgreSQL
- Database accessible from anywhere
- Automatic backups by Supabase
- Free tier available

---

## 🎉 Success Checklist

When everything works:

✅ `npm run dev` runs without errors  
✅ Homepage loads at http://localhost:3000  
✅ Can browse products  
✅ Can add items to cart  
✅ Can log in / sign up  
✅ Admin panel works at http://localhost:3000/admin  
✅ Data is saved in Supabase database  

---

## 📝 Quick Commands Reference

```bash
# Start app
npm run dev

# View database
npx prisma studio

# Check database connection
npx prisma db pull

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

---

## 🔗 Important URLs

- **App:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Database GUI:** http://localhost:5555 (when running `npx prisma studio`)
- **Supabase Dashboard:** https://app.supabase.com

---

## ⏱️ Total Time: 15-20 Minutes

Much faster than local PostgreSQL setup!

---

**You're almost there! Just install Node.js and configure your Supabase credentials.** 🚀
