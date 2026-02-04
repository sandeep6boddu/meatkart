# 🚀 GET MEATKART RUNNING - Simple Guide

Follow these steps **in order** to get MeatKart running on your Mac.

---

## ⚠️ CURRENT STATUS

❌ Node.js - **NOT INSTALLED** (Required!)  
❓ PostgreSQL - **Unknown** (Required!)  
❓ Supabase - **Not configured** (Required!)  

---

## 📝 STEP 1: Install Node.js (5 minutes)

### Option A: Using Homebrew (Recommended)

Open Terminal and run:

```bash
# If you don't have Homebrew, install it first:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node.js:
brew install node@20

# Verify installation:
node --version
npm --version
```

### Option B: Direct Download

1. Go to: https://nodejs.org/
2. Download the **LTS version** (v20.x.x)
3. Run the installer
4. Follow the installation wizard
5. Restart Terminal
6. Verify: `node --version`

---

## 📝 STEP 2: Install PostgreSQL (5 minutes)

### Option A: Using Homebrew (Recommended)

```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Verify it's running
psql --version
```

### Option B: Using Docker (If you have Docker)

```bash
docker run --name meatkart-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=meatkart \
  -p 5432:5432 \
  -d postgres:14

# Verify it's running
docker ps
```

### Option C: Direct Download

1. Go to: https://www.postgresql.org/download/macosx/
2. Download PostgreSQL 14+
3. Run the installer
4. Remember the password you set!

---

## 📝 STEP 3: Create Database (2 minutes)

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql, run:
CREATE DATABASE meatkart;

# Verify it was created:
\l

# Exit:
\q
```

If you get "psql: command not found", PostgreSQL isn't in your PATH. Try:
```bash
/Applications/Postgres.app/Contents/Versions/latest/bin/psql -U postgres
```

---

## 📝 STEP 4: Set Up Supabase (10 minutes)

### 4.1: Create Supabase Account

1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub/Google/Email
4. Verify your email

### 4.2: Create Project

1. Click "New Project"
2. Fill in:
   - **Name:** meatkart
   - **Database Password:** (create a strong password - save it!)
   - **Region:** Choose closest to you
3. Click "Create new project"
4. Wait 2 minutes for setup

### 4.3: Get API Credentials

1. Go to **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 4.4: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Save

---

## 📝 STEP 5: Configure MeatKart (5 minutes)

### 5.1: Create Environment File

In Terminal, run:

```bash
cd /Users/boddu/Documents/Webenrich/meatkart

# Create .env.local file
cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/meatkart"
DIRECT_URL="postgresql://postgres:password@localhost:5432/meatkart"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="REPLACE_WITH_YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="REPLACE_WITH_YOUR_SUPABASE_KEY"

# Node Environment
NODE_ENV="development"
EOF
```

### 5.2: Edit the File

Open `.env.local` in a text editor and replace:
- `password` → Your PostgreSQL password (if you changed it)
- `REPLACE_WITH_YOUR_SUPABASE_URL` → Your Supabase Project URL
- `REPLACE_WITH_YOUR_SUPABASE_KEY` → Your Supabase anon key

Save the file!

---

## 📝 STEP 6: Install Dependencies (5 minutes)

```bash
cd /Users/boddu/Documents/Webenrich/meatkart

# Install all dependencies
npm install

# This will take a few minutes...
```

---

## 📝 STEP 7: Set Up Database (3 minutes)

```bash
cd /Users/boddu/Documents/Webenrich/meatkart

# Generate Prisma Client
npx prisma generate

# Run database migrations (creates all tables)
npx prisma migrate dev

# Seed database with sample data (optional but recommended)
npx prisma db seed
```

---

## 📝 STEP 8: Create Admin User (2 minutes)

### Option A: Using Prisma Studio (Easiest)

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
   - **role:** admin ⚠️ **Must be "admin"!**
4. Click **Save 1 change**

### Option B: Using SQL

```bash
psql -U postgres -d meatkart

# Run this:
INSERT INTO users (phone, email, name, role) 
VALUES ('9876543210', 'admin@meatkart.com', 'Admin User', 'admin');

# Exit:
\q
```

---

## 📝 STEP 9: Start the App! 🚀

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

## 📝 STEP 10: Open in Browser

Open your browser and go to:

🌐 **http://localhost:3000**

You should see the MeatKart homepage! 🎉

---

## 🎯 Quick Test Checklist

After the app is running, test these:

- [ ] Homepage loads
- [ ] Images are visible
- [ ] Can browse products
- [ ] Can click on a product
- [ ] Can add to cart
- [ ] Cart shows items
- [ ] Can go to login page
- [ ] Admin panel accessible at http://localhost:3000/admin

---

## 🐛 Common Issues

### "npm: command not found"
→ Node.js is not installed. Go back to Step 1.

### "Error: P1001: Can't reach database server"
→ PostgreSQL is not running. Run:
```bash
brew services start postgresql@14
```

### "Error connecting to database"
→ Check your `.env.local` file:
- Is the password correct?
- Is the database name "meatkart"?
- Is PostgreSQL running?

### "Port 3000 already in use"
→ Kill the process:
```bash
kill -9 $(lsof -ti:3000)
```
Then try `npm run dev` again.

### "Module not found: @prisma/client"
→ Run:
```bash
npx prisma generate
```

### Images not showing
→ They should be in `/public/images/`. Clear cache:
```bash
rm -rf .next
npm run dev
```

---

## 🎉 Success!

When everything works, you should be able to:

✅ Open http://localhost:3000  
✅ See the MeatKart homepage  
✅ Browse products  
✅ Add items to cart  
✅ Log in / Sign up  
✅ Access admin panel (http://localhost:3000/admin)  

---

## 🆘 Still Stuck?

1. **Check Terminal** - Look for error messages
2. **Check Browser Console** - Press F12, look at Console tab
3. **Check Database** - Run `npx prisma studio` to verify tables exist
4. **Check Environment** - Verify `.env.local` has correct values
5. **Review Documentation** - See `INSTALL_GUIDE.md` for detailed help

---

## 📞 Next Steps After It's Running

1. Explore the app
2. Add test products via admin panel
3. Place a test order
4. Review the code in `src/` folder
5. Read `CODE_GUIDE.md` to understand structure

---

## ⏱️ Estimated Time

- **Prerequisites (Node, PostgreSQL, Supabase):** 20-30 minutes
- **Configuration & Setup:** 15-20 minutes
- **Total:** 35-50 minutes

---

## 🔖 Bookmark These URLs

- **App:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Database GUI:** http://localhost:5555 (when running `npx prisma studio`)
- **Supabase Dashboard:** https://app.supabase.com

---

**You got this! Follow each step and you'll have MeatKart running in under an hour.** 🚀

---

## ✅ Progress Tracker

Copy this and check off as you complete each step:

```
[ ] Step 1: Install Node.js
[ ] Step 2: Install PostgreSQL
[ ] Step 3: Create Database
[ ] Step 4: Set Up Supabase
[ ] Step 5: Configure MeatKart (.env.local)
[ ] Step 6: Install Dependencies (npm install)
[ ] Step 7: Set Up Database (migrations)
[ ] Step 8: Create Admin User
[ ] Step 9: Start the App (npm run dev)
[ ] Step 10: Test in Browser
```

**Current Step:** _______________

**Issues encountered:** _______________

---

**Good luck! 🎉**
