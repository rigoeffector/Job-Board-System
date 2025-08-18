#!/bin/bash

echo "🚀 ISCO Job Board - Vercel Deployment Helper"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin https://github.com/rigoeffector/Job-Board-System.git"
    echo "   git push -u origin main"
    exit 1
fi

# Check if code is pushed to GitHub
echo "📋 Prerequisites Check:"
echo "1. ✅ Git repository initialized"
echo "2. 🔍 Checking if code is pushed to GitHub..."

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "   ❌ No GitHub remote found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/rigoeffector/Job-Board-System.git"
    echo "   git push -u origin main"
    exit 1
fi

echo "   ✅ GitHub remote configured"

# Check if latest changes are pushed
if [ "$(git status --porcelain)" ]; then
    echo "   ⚠️  You have uncommitted changes. Please commit and push:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "   ✅ All changes are committed and pushed"
echo ""

echo "🎯 Deployment Strategy:"
echo "We'll deploy your app in two parts:"
echo "1. Backend API (Node.js/Express)"
echo "2. Frontend (React)"
echo ""

echo "📦 Step 1: Deploy Backend"
echo "=========================="
echo "1. Go to https://vercel.com"
echo "2. Click 'New Project'"
echo "3. Import your GitHub repository"
echo "4. Configure:"
echo "   - Framework Preset: Node.js"
echo "   - Root Directory: / (root of your project)"
echo "   - Build Command: (leave empty)"
echo "   - Output Directory: (leave empty)"
echo "   - Install Command: npm install"
echo "5. Add Environment Variables:"
echo "   - NODE_ENV=production"
echo "   - FRONTEND_URL=https://your-frontend-url.vercel.app (update after frontend deploy)"
echo "6. Click Deploy"
echo ""

echo "🌐 Step 2: Deploy Frontend"
echo "==========================="
echo "1. Go to https://vercel.com"
echo "2. Click 'New Project'"
echo "3. Import the same GitHub repository"
echo "4. Configure:"
echo "   - Framework Preset: Create React App"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm run build"
echo "   - Output Directory: build"
echo "   - Install Command: npm install"
echo "5. Add Environment Variables:"
echo "   - REACT_APP_API_URL=https://your-backend-url.vercel.app/api"
echo "6. Click Deploy"
echo ""

echo "🔄 Step 3: Update Backend CORS"
echo "==============================="
echo "After getting your frontend URL:"
echo "1. Go to your Backend Vercel project"
echo "2. Settings → Environment Variables"
echo "3. Update FRONTEND_URL with your actual frontend URL"
echo "4. Redeploy the backend"
echo ""

echo "✅ Step 4: Test Your Deployment"
echo "==============================="
echo "1. Test Backend: https://your-backend-url.vercel.app/api/health"
echo "2. Test Frontend: Visit your frontend URL"
echo "3. Test all functionality:"
echo "   - User registration/login"
echo "   - Job browsing"
echo "   - Job applications"
echo "   - Admin functionality"
echo ""

echo "🔧 Troubleshooting Tips:"
echo "========================"
echo "• Check Vercel logs for errors"
echo "• Verify environment variables are set correctly"
echo "• Ensure CORS is configured properly"
echo "• Test API endpoints directly"
echo ""

echo "📚 For detailed instructions, see: DEPLOYMENT.md"
echo ""
echo "🎉 Happy deploying! 🚀" 