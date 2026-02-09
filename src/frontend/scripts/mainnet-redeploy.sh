#!/bin/bash

# PlayPal Mainnet Redeploy Script
# This script performs a clean, repeatable mainnet deployment
# Run from the frontend directory: ./scripts/mainnet-redeploy.sh

set -e  # Exit on any error

echo "🚀 PlayPal Mainnet Redeploy Script"
echo "=================================="
echo ""

# Check we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from frontend directory"
    exit 1
fi

# Check required tools
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js >= 18"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Please install pnpm >= 8"
    exit 1
fi

if ! command -v dfx &> /dev/null; then
    echo "❌ dfx not found. Please install dfx >= 0.15.0"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be >= 18 (current: $(node --version))"
    exit 1
fi

echo "✅ Prerequisites OK"
echo ""

# Clean install
echo "🧹 Clean install..."
rm -rf node_modules
pnpm install
echo "✅ Dependencies installed"
echo ""

# Type check
echo "🔍 Running TypeScript check..."
pnpm run typescript-check
echo "✅ TypeScript check passed"
echo ""

# Build frontend
echo "🏗️  Building frontend..."
pnpm run build:skip-bindings
echo "✅ Frontend built successfully"
echo ""

# Verify generated files
echo "📄 Verifying generated files..."
if [ ! -f "src/backend.d.ts" ]; then
    echo "❌ Missing src/backend.d.ts"
    exit 1
fi
if [ ! -f "src/config.ts" ]; then
    echo "❌ Missing src/config.ts"
    exit 1
fi
echo "✅ Generated files present"
echo ""

# Deploy to mainnet
echo "🌐 Deploying to IC mainnet..."
cd ..
dfx deploy --network ic backend
dfx deploy --network ic frontend
echo "✅ Deployment complete"
echo ""

# Get frontend URL
FRONTEND_ID=$(dfx canister --network ic id frontend)
echo "🎉 Deployment successful!"
echo ""
echo "Frontend URL: https://${FRONTEND_ID}.ic0.app"
echo ""
echo "📝 Next steps:"
echo "1. Open the URL in a browser"
echo "2. Verify login with Internet Identity works"
echo "3. Check that Discover screen loads"
echo "4. Test core functionality (like/pass, chat, profile)"
echo ""
