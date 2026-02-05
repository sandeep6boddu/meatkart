# Meatkart - E-commerce Platform

A full-featured e-commerce platform for meat and grocery products built with Next.js 15, Prisma, and Supabase.

## Features

- 🛒 Shopping cart with persistent state
- 👤 User authentication and authorization
- 📦 Product catalog with categories
- 💳 Checkout and order management
- 👨‍💼 Admin dashboard for managing products, orders, and users
- 📱 Responsive mobile-first design
- 🔍 Search and filtering
- ⭐ Wishlist functionality
- 💰 Wallet system
- 📍 Multiple delivery addresses
- 📊 Sales reports and analytics

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (Supabase recommended)
- npm or yarn

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/sandeep6webenrich/meatkart.git
cd meatkart
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_postgresql_database_url"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Deployment

This application is configured for AWS EC2 manual deployment.

### Deploy to AWS EC2

See [DEPLOY.md](./DEPLOY.md) for detailed instructions on deploying to AWS EC2.

Quick overview:
1. Launch an EC2 instance (Ubuntu 22.04, t2.micro)
2. Run setup scripts (`setup-ec2.sh`, `setup-swap.sh`)
3. Clone repository and install dependencies
4. Build and start with PM2
5. Access via your EC2 public IP

### Custom Domain & SSL

See [DOMAIN_SSL_SETUP.md](./DOMAIN_SSL_SETUP.md) for setting up a custom domain and HTTPS.

## Project Structure

```
meatkart/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── (admin)/   # Admin dashboard routes
│   │   ├── (shop)/    # Customer-facing routes
│   │   ├── actions/   # Server actions
│   │   └── api/       # API routes
│   ├── components/     # React components
│   ├── lib/           # Utilities and configurations
│   └── store/         # Zustand state management
├── setup-ec2.sh       # Server setup script
├── setup-swap.sh      # Swap memory setup script
└── DEPLOY.md          # Deployment guide
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Admin Access

After deployment, create an admin user:

```bash
npx ts-node prisma/create-admin.ts
```

Then log in at `/admin` with your admin credentials.

## Documentation

- [Installation Guide](./INSTALL_GUIDE.md)
- [Deployment Guide](./DEPLOY.md)
- [Domain & SSL Setup](./DOMAIN_SSL_SETUP.md)
- [Code Guide](./CODE_GUIDE.md)
- [Architecture Diagram](./ARCHITECTURE_DIAGRAM.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please contact the development team.
