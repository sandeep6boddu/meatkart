#!/bin/bash

# Meatkart Server Update Script
# Run this script on your EC2 server to update the application

set -e  # Exit on any error

echo "=========================================="
echo "Starting Meatkart Update..."
echo "=========================================="

# Navigate to project directory
cd ~/meatkart || { echo "Error: Project directory not found"; exit 1; }

echo "✓ In project directory"

# Pull latest changes from GitHub
echo "Pulling latest code from GitHub..."
git pull origin main

echo "✓ Code updated"

# Install any new dependencies
echo "Installing dependencies..."
npm install

echo "✓ Dependencies installed"

# Generate Prisma client (in case schema changed)
echo "Generating Prisma client..."
npx prisma generate

echo "✓ Prisma client generated"

# Run database migrations (if any)
echo "Running database migrations..."
npx prisma migrate deploy || echo "⚠ No migrations to run or migration failed"

# Build the application
echo "Building application..."
npm run build

echo "✓ Build completed"

# Restart PM2 process
echo "Restarting application..."
pm2 restart meatkart

echo "✓ Application restarted"

# Show status
echo ""
echo "=========================================="
echo "Update completed successfully!"
echo "=========================================="
echo ""
pm2 status
echo ""
echo "Check logs with: pm2 logs meatkart"
echo ""
