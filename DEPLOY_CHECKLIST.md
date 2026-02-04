# 🚀 Quick Deployment Checklist

Use this checklist to deploy LearnQuest Studio to Vercel and Railway.

---

## Pre-Deployment

- [ ] Code is committed and pushed to GitHub
- [ ] Firebase project is set up
- [ ] OpenAI API key is available
- [ ] Vercel account created
- [ ] Railway account created

---

## Backend Deployment (Railway)

### 1. Create Railway Project
- [ ] Go to [railway.app](https://railway.app)
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository

### 2. Add PostgreSQL Database
- [ ] Click "New" → "Database" → "PostgreSQL"
- [ ] Wait for database to provision

### 3. Configure Backend Service
- [ ] Click "New" → "GitHub Repo"
- [ ] Select repository
- [ ] Set root directory: `backend`
- [ ] Wait for initial deployment

### 4. Set Environment Variables

Copy these to Railway backend service variables:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=[generate with: openssl rand -base64 32]
FIREBASE_PROJECT_ID=[from Firebase Console]
FIREBASE_CLIENT_EMAIL=[from Firebase Console]
FIREBASE_PRIVATE_KEY=[from Firebase Console - keep quotes and \n]
OPENAI_API_KEY=your-openai-api-key-here
CORS_ORIGIN=[will be your Vercel URL - update later]
```

- [ ] All backend environment variables set
- [ ] Backend deployed successfully
- [ ] Note backend URL: `https://________.railway.app`

---

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel

**Option A: Vercel CLI**
```bash
cd frontend
vercel
```

**Option B: Vercel Dashboard**
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Import GitHub repository
- [ ] Set root directory: `frontend`
- [ ] Framework: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### 2. Set Environment Variables

Add these to Vercel project settings:

```bash
VITE_API_URL=[Your Railway backend URL]/api
VITE_FIREBASE_API_KEY=[from Firebase Console]
VITE_FIREBASE_AUTH_DOMAIN=[from Firebase Console]
VITE_FIREBASE_PROJECT_ID=[from Firebase Console]
VITE_FIREBASE_STORAGE_BUCKET=[from Firebase Console]
VITE_FIREBASE_MESSAGING_SENDER_ID=[from Firebase Console]
VITE_FIREBASE_APP_ID=[from Firebase Console]
```

- [ ] All frontend environment variables set
- [ ] Frontend deployed successfully
- [ ] Note frontend URL: `https://________.vercel.app`

---

## Post-Deployment

### 1. Update Backend CORS
- [ ] Go to Railway → Backend service → Variables
- [ ] Update `CORS_ORIGIN` to your Vercel URL
- [ ] Redeploy backend

### 2. Update Firebase Settings
- [ ] Firebase Console → Authentication → Settings
- [ ] Add authorized domain: Your Vercel domain
- [ ] Add authorized domain: Your Railway domain (if needed)

### 3. Test Deployment

**Backend Health Check:**
- [ ] Visit: `https://your-backend.railway.app/api`
- [ ] Should return API info

**Frontend:**
- [ ] Visit: `https://your-app.vercel.app`
- [ ] Home page loads
- [ ] Can browse games

**Authentication:**
- [ ] Can access admin login
- [ ] Can sign in with Firebase
- [ ] Auth token works with backend

**Full Flow:**
- [ ] Create a test game in admin
- [ ] Add levels and challenges
- [ ] Use AI to generate questions
- [ ] Publish game
- [ ] Play game as player
- [ ] Mini-game loads and works
- [ ] Scoring works
- [ ] Analytics updates

---

## Verification Tests

### Backend API Tests
```bash
# Health check
curl https://your-backend.railway.app/api

# Test games endpoint (should return [])
curl https://your-backend.railway.app/api/games
```

### Frontend Tests
- [ ] Home page loads
- [ ] Admin login works
- [ ] Can create games
- [ ] AI question generation works
- [ ] Mini-games render
- [ ] Responsive on mobile
- [ ] No console errors

---

## Troubleshooting

### If Backend Won't Deploy
1. Check Railway build logs
2. Verify all environment variables
3. Check DATABASE_URL is set
4. Ensure Node version compatibility

### If Frontend Won't Deploy
1. Check Vercel build logs
2. Test build locally: `cd frontend && npm run build`
3. Verify environment variables
4. Check API URL is correct

### If CORS Errors
1. Verify CORS_ORIGIN in Railway
2. Must include https://
3. No trailing slash
4. Redeploy backend after changing

### If Database Connection Fails
1. Check Postgres service is running on Railway
2. Verify DATABASE_URL variable
3. Check SSL settings in app.module.ts

---

## Custom Domains (Optional)

### Vercel Custom Domain
- [ ] Vercel → Settings → Domains
- [ ] Add custom domain
- [ ] Update DNS records
- [ ] Update Firebase authorized domains
- [ ] Update CORS_ORIGIN in Railway

### Railway Custom Domain
- [ ] Railway → Settings → Domains
- [ ] Add custom domain
- [ ] Update DNS records
- [ ] Update VITE_API_URL in Vercel

---

## Monitoring Setup

### Vercel
- [ ] Enable Analytics in Vercel dashboard
- [ ] Set up error tracking (optional)
- [ ] Configure alerts

### Railway
- [ ] Monitor CPU/Memory in Metrics tab
- [ ] Set up log alerts (optional)
- [ ] Configure backup schedule for Postgres

---

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Firebase private key is secure
- [ ] OpenAI API key is not exposed
- [ ] HTTPS only (automatic)
- [ ] CORS is restricted to your domain
- [ ] Database uses SSL in production
- [ ] No .env files committed to Git
- [ ] API rate limiting configured (optional)

---

## Success Criteria

✅ Backend deployed and accessible
✅ Frontend deployed and accessible
✅ Database connected and working
✅ Authentication functional
✅ AI features working
✅ Mini-games playable
✅ No critical errors in logs
✅ Mobile responsive
✅ HTTPS enabled
✅ CORS configured correctly

---

## Quick Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Railway Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com)
- **OpenAI Dashboard**: [platform.openai.com](https://platform.openai.com)

---

## Deployment Commands

```bash
# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Deploy to production"
git push origin main

# Deploy frontend manually (Vercel CLI)
cd frontend
vercel --prod

# View Railway logs
railway logs

# View Vercel logs
vercel logs
```

---

## Need Help?

- See full guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Setup guide: [SETUP.md](SETUP.md)
- User guide: [USER_GUIDE.md](USER_GUIDE.md)

---

**🎉 Once all checkboxes are complete, your app is live!**

**Frontend**: `https://__________.vercel.app`
**Backend**: `https://__________.railway.app`

Share your learning platform with the world! 🌍
