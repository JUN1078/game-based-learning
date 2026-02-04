# 🚀 Deployment Guide - LearnQuest Studio

Complete guide to deploy your application to **Vercel** (Frontend) and **Railway** (Backend + Database).

---

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account
- [ ] Vercel account ([vercel.com](https://vercel.com))
- [ ] Railway account ([railway.app](https://railway.app))
- [ ] Firebase project set up
- [ ] OpenAI API key

---

## 🎯 Deployment Overview

```
Frontend (React)  →  Vercel  →  https://your-app.vercel.app
Backend (NestJS)  →  Railway  →  https://your-api.railway.app
Database (PostgreSQL)  →  Railway  →  Connected automatically
```

---

## Part 1: Deploy Backend to Railway

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - LearnQuest Studio"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/learnquest-studio.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `learnquest-studio` repository
5. Railway will detect the monorepo

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"New"**
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Railway automatically creates the database

### Step 4: Configure Backend Service

1. Click **"New"** → **"GitHub Repo"**
2. Select your repository again
3. Set **Root Directory**: `backend`
4. Railway will auto-detect Node.js

### Step 5: Set Environment Variables

In Railway, go to your backend service → **Variables** tab:

```bash
# Application
NODE_ENV=production
PORT=3000

# Database (Auto-filled by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Or set manually:
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}

# JWT Secret (Generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"

# OpenAI
OPENAI_API_KEY=your-openai-api-key-here

# CORS (Will be your Vercel domain)
CORS_ORIGIN=https://your-app.vercel.app
```

**Important Notes:**
- Railway provides PostgreSQL credentials automatically via `${{Postgres.VARIABLE}}`
- Generate a strong JWT secret: `openssl rand -base64 32`
- Get Firebase private key from Firebase Console → Project Settings → Service Accounts
- Replace `\n` in private key with actual newlines

### Step 6: Deploy Backend

1. Railway will automatically deploy when you push to GitHub
2. Check the **Deployments** tab for build logs
3. Once deployed, you'll get a URL like: `https://learnquest-backend-production.up.railway.app`

### Step 7: Add Domain (Optional)

1. In Railway → Settings → **Domains**
2. Click **"Generate Domain"** or **"Custom Domain"**
3. Note this URL for frontend configuration

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend Build

Ensure your frontend is ready:

```bash
cd frontend
npm install
npm run build  # Test local build
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Scope: Your account
# - Link to existing project? No
# - Project name: learnquest-studio
# - Directory: ./
# - Override settings? No
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

In Vercel → Project Settings → **Environment Variables**:

```bash
# API URL (Your Railway backend URL)
VITE_API_URL=https://your-backend.railway.app/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Get Firebase Config:**
1. Firebase Console → Project Settings
2. Scroll to "Your apps"
3. Select Web app or create one
4. Copy the config values

### Step 4: Deploy Frontend

1. Vercel will automatically deploy
2. You'll get a URL like: `https://learnquest-studio.vercel.app`
3. Check the deployment logs

### Step 5: Update CORS in Backend

Go back to Railway → Backend Service → Variables:

```bash
CORS_ORIGIN=https://learnquest-studio.vercel.app
```

Redeploy backend to apply changes.

---

## Part 3: Post-Deployment Configuration

### 1. Update Firebase Authorized Domains

1. Firebase Console → Authentication → Settings
2. **Authorized domains** → Add:
   - `your-app.vercel.app`
   - `your-backend.railway.app` (if needed)

### 2. Test the Deployment

**Backend Health Check:**
```bash
curl https://your-backend.railway.app/api
# Should return: {"message": "API is running"}
```

**Frontend:**
Visit `https://your-app.vercel.app`

### 3. Database Migrations

If needed, run migrations on Railway:

```bash
# SSH into Railway (from Railway CLI)
railway run npm run migration:run
```

Or set up automatic migrations in your build command.

---

## 🔧 Environment Variables Checklist

### Frontend (Vercel)
- [ ] `VITE_API_URL` - Railway backend URL
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`

### Backend (Railway)
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `DB_HOST` (from Railway Postgres)
- [ ] `DB_PORT` (from Railway Postgres)
- [ ] `DB_USERNAME` (from Railway Postgres)
- [ ] `DB_PASSWORD` (from Railway Postgres)
- [ ] `DB_DATABASE` (from Railway Postgres)
- [ ] `JWT_SECRET` (generate strong secret)
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_PRIVATE_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `CORS_ORIGIN` (Vercel frontend URL)

---

## 🔄 Continuous Deployment

### Automatic Deploys on Push

Both Vercel and Railway will automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel and Railway will auto-deploy
```

### Deploy Specific Branches

**Vercel:**
- Main branch → Production
- Other branches → Preview deployments

**Railway:**
- Configure in Settings → Deployments
- Choose branch to deploy

---

## 🐛 Troubleshooting

### Frontend Issues

**Build Fails:**
```bash
# Check build locally
cd frontend
npm install
npm run build
```

**API Connection Failed:**
- Verify `VITE_API_URL` is correct
- Check backend is running on Railway
- Verify CORS settings

**Firebase Auth Not Working:**
- Check Firebase config variables
- Verify authorized domains in Firebase Console

### Backend Issues

**Database Connection Failed:**
```bash
# Check Railway Postgres is running
# Verify DATABASE_URL or individual DB variables
# Check logs in Railway dashboard
```

**Build Fails:**
```bash
# Test locally
cd backend
npm install
npm run build
npm run start:prod
```

**CORS Errors:**
- Update `CORS_ORIGIN` in Railway
- Redeploy backend

**OpenAI API Fails:**
- Verify `OPENAI_API_KEY` is correct
- Check API quota and billing

---

## 📊 Monitoring & Logs

### Vercel Logs

1. Vercel Dashboard → Your Project → Deployments
2. Click on a deployment → View Logs
3. Real-time function logs available

### Railway Logs

1. Railway Dashboard → Your Service
2. **Deployments** tab → View logs
3. **Metrics** tab → CPU, Memory, Network

---

## 🔒 Security Best Practices

### Production Checklist

- [ ] Use strong `JWT_SECRET`
- [ ] Never commit `.env` files
- [ ] Keep Firebase private key secure
- [ ] Rotate API keys regularly
- [ ] Enable HTTPS only (auto on Vercel/Railway)
- [ ] Set up rate limiting
- [ ] Monitor API usage
- [ ] Regular security updates

### Environment Security

```bash
# Generate strong secrets
openssl rand -base64 32

# Never log sensitive data
# Use Railway/Vercel secret management
# Rotate keys periodically
```

---

## 💰 Cost Estimates

### Free Tier Limits

**Vercel (Hobby - Free):**
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Git integration
- Analytics included

**Railway (Trial - Free $5 credit):**
- $5/month usage credit
- Pay-as-you-go after trial
- PostgreSQL database included
- 500 MB memory per service
- Estimate: ~$5-10/month for small apps

**Firebase (Spark - Free):**
- 10K verifications/month
- Generous free tier
- Upgrade to Blaze for production

**OpenAI:**
- Pay-per-use
- GPT-4: ~$0.03 per 1K tokens
- Monitor usage in OpenAI dashboard

---

## 🚀 Going Live Checklist

Before launching to production:

### Technical
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] CORS configured correctly
- [ ] Firebase domains authorized
- [ ] SSL/HTTPS enabled (automatic)
- [ ] Error logging configured
- [ ] Backups scheduled (Railway Postgres)

### Testing
- [ ] Test all user flows
- [ ] Verify authentication works
- [ ] Test AI question generation
- [ ] Play mini-games
- [ ] Check analytics
- [ ] Mobile responsive test
- [ ] Cross-browser testing

### Content
- [ ] Create sample games
- [ ] Add learning objectives
- [ ] Test question quality
- [ ] Verify scoring system

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor API usage
- [ ] Track user metrics
- [ ] Database performance

---

## 🔄 Update Process

To update your deployed app:

```bash
# 1. Make changes locally
git add .
git commit -m "Feature: Add new game type"

# 2. Test locally
npm run dev  # Test both frontend and backend

# 3. Push to GitHub
git push origin main

# 4. Automatic deployment
# Vercel and Railway will auto-deploy
# Check deployment status in dashboards

# 5. Verify production
# Test at your live URLs
```

---

## 📞 Support

### Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)

### Common Commands

```bash
# Vercel
vercel login
vercel deploy
vercel env pull  # Download env vars
vercel logs

# Railway
railway login
railway up  # Deploy
railway logs
railway run <command>  # Run command on server
```

---

## 🎉 Success!

Your LearnQuest Studio is now live! 🚀

**Frontend**: `https://your-app.vercel.app`
**Backend API**: `https://your-backend.railway.app/api`

Share your creation with the world! 🌍

---

**Need Help?**
- Check logs in Vercel/Railway dashboards
- Review [SETUP.md](SETUP.md) for local development
- See [USER_GUIDE.md](USER_GUIDE.md) for platform usage
