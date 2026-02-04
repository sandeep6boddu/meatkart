# 🚀 Start MeatKart NOW - You Have Supabase!

Since you already have a Supabase database, you only need **2 things** to run MeatKart:

---

## ✅ What You Already Have:
- ✓ Supabase database
- ✓ Project dependencies installed
- ✓ Prisma Client generated

## 🎯 What You Need (Just 2 Things!):

### 1. Install Node.js (5 minutes)
### 2. Configure Supabase credentials (5 minutes)

**Total time: 10 minutes!**

---

## 📝 STEP 1: Install Node.js

Open Terminal and run:

```bash
brew install node@20
```

Wait for it to finish, then verify:

```bash
node --version
npm --version
```

**Alternative:** Download from https://nodejs.org/ (get v20 LTS)

---

## 📝 STEP 2: Get Your Supabase Credentials

### A. Get Database Connection String

1. Go to https://app.supabase.com
2. Open your MeatKart project
3. Click **Settings** (gear icon) → **Database**
4. Scroll to **Connection string** section
5. Click **URI** tab
6. Copy the entire string (looks like):
   ```
   postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres
   ```

### B. Get API Credentials

1. Go to **Settings** → **API**
2. Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Copy **anon public** key (long string starting with `eyJ...`)

---

## 📝 STEP 3: Create .env.local File

In Terminal, navigate to your project:

```bash
cd /Users/boddu/Documents/Webenrich/meatkart
```

Create the `.env.local` file with your text editor or run:

```bash
nano .env.local
```

Paste this content (replace with YOUR actual values):

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.xxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YOUR-PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Environment
NODE_ENV="development"
```

**Important:** Replace ALL placeholder values with your actual Supabase credentials!

Save the file:
- If using nano: Press `Ctrl+X`, then `Y`, then `Enter`
- If using text editor: Just save normally

---

## 📝 STEP 4: Set Up Database Tables

Run these commands:

```bash
cd /Users/boddu/Documents/Webenrich/meatkart

# Create all tables in Supabase
npx prisma db push

# Add sample data (optional but recommended)
npx prisma db seed
```

---

## 📝 STEP 5: Create Admin User

```bash
# Open database GUI
npx prisma studio
```

This opens http://localhost:5555

1. Click **users** table
2. Click **Add record**
3. Fill in:
   - phone: `9876543210`
   - email: `admin@meatkart.com`
   - name: `Admin User`
   - role: `admin` ⚠️ **MUST be "admin"**
4. Click **Save 1 change**

Close the browser tab.

---

## 📝 STEP 6: Start the App! 🎉

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.5.9
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

---

## 📝 STEP 7: Open in Browser

Open: **http://localhost:3000**

🎉 **You should see MeatKart homepage!**

---

## 🎯 Test Everything:

- [ ] Homepage loads
- [ ] Can view products
- [ ] Can add to cart
- [ ] Cart shows items
- [ ] Can sign up at http://localhost:3000/auth/signup
- [ ] Can log in at http://localhost:3000/auth/login
- [ ] Admin panel works at http://localhost:3000/admin

---

## 🐛 Common Issues

### "npm: command not found"
→ Node.js not installed. Go back to Step 1.

### "Can't reach database server"
→ Check your `.env.local`:
- Is DATABASE_URL correct?
- Did you replace YOUR-PASSWORD with actual password?
- Is your Supabase project running?

### "Invalid Supabase URL"
→ Check `.env.local`:
- NEXT_PUBLIC_SUPABASE_URL must start with `https://`
- Use the anon key, NOT service_role key

### "Port 3000 already in use"
```bash
kill -9 $(lsof -ti:3000)
npm run dev
```

---

## 📋 Quick Reference

```bash
# Start app
npm run dev

# View database
npx prisma studio

# Check database
npx prisma db pull

# Push schema to database
npx prisma db push

# Add sample data
npx prisma db seed
```

---

## 🔗 URLs You'll Use

- **App:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Database GUI:** http://localhost:5555 (with `npx prisma studio`)
- **Supabase:** https://app.supabase.com

---

## ✅ Success!

When it works, you'll be able to:

✅ Browse products  
✅ Add to cart  
✅ Sign up / Log in  
✅ Place orders  
✅ Access admin panel  
✅ Manage products (admin)  
✅ View orders (admin)  

All data will be stored in your Supabase database! 🎉

---

## 📁 Files I Created for You

1. **START_NOW.md** ← You are here! (simple guide)
2. **SETUP_WITH_SUPABASE_DB.md** (detailed version)
3. **env.template.txt** (environment file template)
4. **check-prerequisites.sh** (check what's installed)
5. Plus 9 other documentation files for reference

---

## ⏱️ Total Time: 10-15 Minutes

Since you have Supabase, this is super quick!

---

## 🎓 After It's Running

1. Explore the app
2. Add products via admin panel
3. Test placing an order
4. Check data in Supabase dashboard
5. Read the other documentation to understand the code

---

**You're almost there! Just install Node.js and configure your Supabase credentials!** 🚀

Need help? All the credentials are in your Supabase dashboard at https://app.supabase.com
