# 🚀 ISCO Job Board - Vercel Deployment Guide

This guide will help you deploy your ISCO job board application to Vercel.

## 📋 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js**: Version 16 or higher

## 🎯 Deployment Strategy

We'll deploy the application in two parts:
1. **Backend API** (Node.js/Express)
2. **Frontend** (React)

## 📦 Step 1: Prepare Your Repository

### 1.1 Update Backend Dependencies
Make sure your backend `package.json` has all necessary dependencies:

```json
{
  "name": "job-board-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1"
  }
}
```

### 1.2 Environment Variables
Create environment variables for production:

**Backend Environment Variables:**
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-frontend-url.vercel.app`

**Frontend Environment Variables:**
- `REACT_APP_API_URL=https://your-backend-url.vercel.app/api`

## 🚀 Step 2: Deploy Backend to Vercel

### 2.1 Deploy Backend
1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Node.js
   - **Root Directory**: `/` (root of your project)
   - **Build Command**: Leave empty (not needed for Node.js API)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### 2.2 Configure Backend Environment Variables
In your Vercel project dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

### 2.3 Deploy
Click **Deploy** and wait for the deployment to complete.

**Note your backend URL**: `https://your-project-name.vercel.app`

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Deploy Frontend
1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import the same GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 3.2 Configure Frontend Environment Variables
In your Vercel project dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```

### 3.3 Deploy
Click **Deploy** and wait for the deployment to complete.

**Note your frontend URL**: `https://your-frontend-project-name.vercel.app`

## 🔄 Step 4: Update Backend CORS

After getting your frontend URL, update the backend environment variable:
1. Go to your **Backend Vercel project**
2. **Settings** → **Environment Variables**
3. Update `FRONTEND_URL` with your actual frontend URL
4. **Redeploy** the backend

## ✅ Step 5: Test Your Deployment

### 5.1 Test Backend
Visit: `https://your-backend-url.vercel.app/api/health`
Should return: `{"status":"OK","message":"Job Board API is running"}`

### 5.2 Test Frontend
Visit your frontend URL and test:
- ✅ User registration/login
- ✅ Job browsing
- ✅ Job applications
- ✅ Admin functionality

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure `FRONTEND_URL` is set correctly in backend
   - Redeploy backend after updating environment variables

2. **API Connection Issues**
   - Verify `REACT_APP_API_URL` is set correctly in frontend
   - Check that backend is deployed and accessible

3. **Database Issues**
   - SQLite database is created automatically on first request
   - Check Vercel logs for database initialization errors

4. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

### Vercel Logs
- Go to your project dashboard
- Click on a deployment
- Check **Functions** tab for backend logs
- Check **Build Logs** for frontend build issues

## 🌍 Custom Domains (Optional)

1. **Go to your Vercel project**
2. **Settings** → **Domains**
3. **Add your custom domain**
4. **Update DNS records** as instructed

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: Monitor API performance
- **Error Tracking**: Set up error monitoring (e.g., Sentry)

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Rate Limiting**: Already configured in your backend
3. **CORS**: Properly configured for production
4. **Helmet**: Security headers enabled

## 🎉 Success!

Your ISCO job board is now live on Vercel! 

**Frontend**: `https://your-frontend-url.vercel.app`
**Backend API**: `https://your-backend-url.vercel.app/api`

---

## 📞 Support

If you encounter issues:
1. Check Vercel documentation
2. Review deployment logs
3. Verify environment variables
4. Test locally first

Happy deploying! 🚀 