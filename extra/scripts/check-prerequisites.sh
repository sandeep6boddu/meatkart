#!/bin/bash

# MeatKart Prerequisites Checker
# This script checks if you have everything needed to run MeatKart

echo "🔍 MeatKart Prerequisites Checker"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

MISSING=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Found${NC} $NODE_VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "  Install: brew install node@20"
    echo "  Or visit: https://nodejs.org/"
    MISSING=1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ Found${NC} v$NPM_VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    MISSING=1
fi

# Check PostgreSQL
echo -n "Checking PostgreSQL... "
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version | awk '{print $3}')
    echo -e "${GREEN}✓ Found${NC} $PG_VERSION"
    
    # Check if PostgreSQL is running
    echo -n "Checking PostgreSQL status... "
    if pg_isready &> /dev/null; then
        echo -e "${GREEN}✓ Running${NC}"
    else
        echo -e "${YELLOW}⚠ Not running${NC}"
        echo "  Start with: brew services start postgresql@14"
    fi
else
    echo -e "${RED}✗ Not found${NC}"
    echo "  Install: brew install postgresql@14"
    echo "  Or visit: https://www.postgresql.org/download/"
    MISSING=1
fi

# Check if .env.local exists
echo -n "Checking .env.local... "
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    
    # Check if it has required values
    if grep -q "REPLACE_WITH" .env.local 2>/dev/null; then
        echo -e "${YELLOW}  ⚠ Contains placeholder values - needs configuration${NC}"
    fi
else
    echo -e "${RED}✗ Not found${NC}"
    echo "  Create this file with database and Supabase credentials"
    MISSING=1
fi

# Check if node_modules exists
echo -n "Checking dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
    echo "  Run: npm install"
    MISSING=1
fi

# Check if Prisma Client is generated
echo -n "Checking Prisma Client... "
if [ -d "node_modules/.prisma/client" ]; then
    echo -e "${GREEN}✓ Generated${NC}"
else
    echo -e "${YELLOW}⚠ Not generated${NC}"
    echo "  Run: npx prisma generate"
fi

echo ""
echo "=================================="

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✓ All prerequisites are installed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Configure .env.local with your credentials"
    echo "  2. Run: npx prisma migrate dev"
    echo "  3. Run: npm run dev"
    echo "  4. Open: http://localhost:3000"
else
    echo -e "${RED}✗ Missing prerequisites!${NC}"
    echo ""
    echo "Please install the missing items above."
    echo "See RUN_ME_FIRST.md for detailed instructions."
fi

echo ""
