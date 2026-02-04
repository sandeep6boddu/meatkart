#!/bin/bash

# MeatKart Quick Start Script
# This script helps set up the development environment

set -e  # Exit on error

echo "🥩 MeatKart Quick Start Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo ""
    echo "Please install Node.js v20 or higher:"
    echo "  macOS: brew install node@20"
    echo "  Or visit: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: v$NPM_VERSION"
fi

# Check if PostgreSQL is installed
echo ""
echo "Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version | awk '{print $3}')
    print_success "PostgreSQL is installed: $PG_VERSION"
else
    print_warning "PostgreSQL not found in PATH"
    echo "  You can install it with: brew install postgresql@14"
    echo "  Or use Docker: docker run --name meatkart-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=meatkart -p 5432:5432 -d postgres:14"
fi

# Check if .env.local exists
echo ""
echo "Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    print_warning ".env.local file not found"
    echo ""
    echo "Creating .env.local from template..."
    
    cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/meatkart"
DIRECT_URL="postgresql://postgres:password@localhost:5432/meatkart"

# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# Node Environment
NODE_ENV="development"
EOF
    
    print_success "Created .env.local file"
    print_warning "⚠️  IMPORTANT: You need to update .env.local with your actual credentials!"
    echo ""
    echo "  1. Update DATABASE_URL with your PostgreSQL credentials"
    echo "  2. Create a Supabase project at https://supabase.com"
    echo "  3. Update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    read -p "Press Enter to continue after updating .env.local..."
else
    print_success ".env.local file exists"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
if [ ! -d "node_modules" ]; then
    print_info "Running npm install (this may take a few minutes)..."
    npm install
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
    read -p "Reinstall dependencies? (y/N): " reinstall
    if [ "$reinstall" = "y" ] || [ "$reinstall" = "Y" ]; then
        npm install
        print_success "Dependencies reinstalled"
    fi
fi

# Generate Prisma Client
echo ""
echo "Setting up Prisma..."
print_info "Generating Prisma Client..."
npx prisma generate
print_success "Prisma Client generated"

# Check database connection
echo ""
echo "Checking database connection..."
if npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
    print_success "Database connection successful"
    
    # Run migrations
    echo ""
    read -p "Run database migrations? (Y/n): " run_migrations
    if [ "$run_migrations" != "n" ] && [ "$run_migrations" != "N" ]; then
        print_info "Running migrations..."
        npx prisma migrate dev --name init
        print_success "Migrations completed"
        
        # Seed database
        echo ""
        read -p "Seed database with sample data? (Y/n): " seed_db
        if [ "$seed_db" != "n" ] && [ "$seed_db" != "N" ]; then
            if [ -f "prisma/seed.ts" ]; then
                print_info "Seeding database..."
                npx prisma db seed
                print_success "Database seeded"
            else
                print_warning "Seed file not found, skipping..."
            fi
        fi
    fi
else
    print_error "Cannot connect to database"
    echo ""
    echo "Please ensure:"
    echo "  1. PostgreSQL is running"
    echo "  2. Database 'meatkart' exists"
    echo "  3. Credentials in .env.local are correct"
    echo ""
    echo "To create database:"
    echo "  psql -U postgres -c 'CREATE DATABASE meatkart;'"
fi

# Summary
echo ""
echo "=============================="
echo "🎉 Setup Complete!"
echo "=============================="
echo ""
echo "Next steps:"
echo ""
echo "1. Verify your .env.local configuration"
echo "2. Create an admin user:"
echo "   npx prisma studio"
echo "   (Add a user with role='admin')"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "📚 For detailed instructions, see INSTALL_GUIDE.md"
echo ""

# Ask if user wants to start dev server
read -p "Start development server now? (y/N): " start_server
if [ "$start_server" = "y" ] || [ "$start_server" = "Y" ]; then
    echo ""
    print_info "Starting development server..."
    echo ""
    npm run dev
fi
