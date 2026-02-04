# 🚀 Deploy NOW - Step by Step Guide

Your code is ready to deploy! Follow these exact steps.

---

## ✅ What's Already Done

- ✅ Git initialized
- ✅ Code committed (93 files)
- ✅ All deployment configs ready
- ✅ Environment templates created

---

## 📝 Step 1: Create GitHub Repository (2 minutes)

### Option A: Using GitHub Website (Easiest)

1. **Go to GitHub:** https://github.com/new

2. **Repository settings:**
   - Repository name: `learnquest-studio`
   - Description: `Game-based learning platform with AI and Phaser.js`
   - Visibility: **Private** (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license

3. **Click "Create repository"**

4. **Copy the repository URL** (looks like: `https://github.com/YOUR_USERNAME/learnquest-studio.git`)

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create learnquest-studio --private --source=. --remote=origin --push
```

---

## 📤 Step 2: Push to GitHub (30 seconds)

**After creating the repository, run these commands:**

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/learnquest-studio.git

# Push your code
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## 🛤️ Step 3: Deploy Backend to Railway (10 minutes)

### 3.1 Create Railway Account & Project

1. **Go to Railway:** https://railway.app/
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose:** `learnquest-studio`
6. **Railway will start deploying** - wait for it to detect the monorepo

### 3.2 Add PostgreSQL Database

1. **In your Railway project**, click **"New"**
2. **Select "Database"**
3. **Choose "PostgreSQL"**
4. **Wait for database to provision** (~30 seconds)

### 3.3 Configure Backend Service

1. **Click "New"** again
2. **Select "GitHub Repo"** → Choose your repo again
3. **Railway Settings:**
   - Click on the service
   - Go to **"Settings"** tab
   - **Root Directory:** Type `backend`
   - **Build Command:** Leave default (Railway auto-detects)
   - **Start Command:** Leave default (`npm run start:prod`)

### 3.4 Set Environment Variables

**In Railway, click on your backend service → "Variables" tab**

**Add these variables ONE BY ONE:**

```bash
NODE_ENV=production
PORT=3000
```

**Database (Use Railway's automatic references):**
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**JWT Secret (Generate one):**

To generate a secure secret, run this in your terminal:
```bash
openssl rand -base64 32
```

Then add:
```bash
JWT_SECRET=[paste the generated secret here]
```

**Firebase (You'll need Firebase Console):**
```bash
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

**To get Firebase credentials:**
- Go to https://console.firebase.google.com
- Select your project (or create one)
- Settings → Service Accounts → Generate new private key
- Copy values from the downloaded JSON file

**OpenAI API Key:**
```bash
OPENAI_API_KEY=your-openai-api-key-here
```

**CORS (Will update after Vercel deployment):**
```bash
CORS_ORIGIN=https://your-app.vercel.app
```

### 3.5 Deploy Backend

1. **Railway will auto-deploy** after you save variables
2. **Wait for deployment** (~3-5 minutes)
3. **Check the "Deployments" tab** for build logs
4. **Once deployed**, click "Settings" → **Generate Domain**
5. **Copy your backend URL:** `https://your-app.up.railway.app`

**✅ Backend is live!**

---

## 🌐 Step 4: Deploy Frontend to Vercel (5 minutes)

### 4.1 Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

### 4.2 Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### 4.3 Deploy Frontend

```bash
cd frontend
vercel
```

**Answer the prompts:**
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name:** → `learnquest-studio` (or your choice)
- **In which directory is your code located?** → `./`
- **Override settings?** → No

Vercel will deploy and give you a URL like: `https://learnquest-studio.vercel.app`

### 4.4 Set Production Environment Variables

**Go to Vercel Dashboard:**
1. https://vercel.com/dashboard
2. Click on your project → **"Settings"** → **"Environment Variables"**

**Add these variables:**

```bash
VITE_API_URL=https://your-backend.up.railway.app/api
```
**⚠️ Replace with your actual Railway backend URL!**

**Firebase Frontend Config:**
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef
```

**To get these values:**
- Firebase Console → Project Settings → General
- Scroll to "Your apps" → Web app
- Copy config values

### 4.5 Redeploy with Environment Variables

```bash
vercel --prod
```

**✅ Frontend is live!**

---

## 🔧 Step 5: Final Configuration (2 minutes)

### 5.1 Update CORS in Railway

1. **Go to Railway** → Your backend service → **"Variables"**
2. **Update `CORS_ORIGIN`:**
   ```bash
   CORS_ORIGIN=https://your-app.vercel.app
   ```
3. **Redeploy** backend (Railway will auto-redeploy on variable change)

### 5.2 Update Firebase Authorized Domains

1. **Firebase Console** → **Authentication** → **Settings**
2. **Authorized domains** → Click **"Add domain"**
3. Add both:
   - `your-app.vercel.app`
   - `your-backend.up.railway.app` (if needed)

---

## ✅ Step 6: Test Your Deployment!

### Test Backend API

```bash
curl https://your-backend.up.railway.app/api/games
```

**Expected:** `[]` (empty array)

### Test Frontend

**Visit:** `https://your-app.vercel.app`

**You should see:**
- ✅ LearnQuest Studio home page
- ✅ No console errors
- ✅ Can navigate to admin login

### Test Full Flow

1. **Go to admin login:** `https://your-app.vercel.app/admin/login`
2. **Sign up with Firebase email/password**
3. **Create a test game**
4. **Add levels and challenges**
5. **Test AI question generation**
6. **Publish and play!**

---

## 🎉 Success Criteria

**Your deployment is complete when:**

- ✅ Backend API responds at Railway URL
- ✅ Frontend loads at Vercel URL
- ✅ Can access admin panel
- ✅ Firebase authentication works
- ✅ Database connected (no errors)
- ✅ AI features work
- ✅ Can create and play games

---

## 🆘 Troubleshooting

### Backend won't deploy on Railway

**Check:**
- Root directory is set to `backend`
- All environment variables are set
- DATABASE_URL uses `${{Postgres.DATABASE_URL}}`
- View deployment logs for errors

### Frontend won't deploy on Vercel

**Check:**
- Framework preset: Vite (auto-detected)
- Root directory: frontend
- Environment variables are set
- Build command: `npm run build`
- Output directory: `dist`

### CORS errors

**Fix:**
- Ensure `CORS_ORIGIN` in Railway matches your Vercel URL exactly
- Include `https://`
- No trailing slash
- Redeploy backend after changing

### Firebase auth not working

**Check:**
- All Firebase env variables are correct
- Authorized domains include your Vercel domain
- Authentication is enabled in Firebase Console
- Email/Password sign-in method is enabled

### Database connection failed

**Check:**
- PostgreSQL service is running on Railway
- DATABASE_URL is set correctly
- Check backend deployment logs

---

## 📊 Your Deployment URLs

**After deployment, you'll have:**

**Frontend:** `https://learnquest-studio.vercel.app`
**Backend:** `https://learnquest-studio-production.up.railway.app`
**Database:** Managed by Railway (internal)

**Update these in your README!**

---

## 🔄 Future Deployments

**To update your deployed app:**

```bash
# Make changes to your code
git add .
git commit -m "Update: your changes"
git push origin main

# Railway and Vercel will auto-deploy!
```

---

## 💰 Cost Estimate

**Free Tier:**
- ✅ Vercel: 100% free (Hobby plan)
- ✅ Railway: $5 credit included
- 💵 After trial: ~$5-10/month for Railway (small apps)

---

## 🎯 Quick Command Reference

```bash
# Push updates
git add .
git commit -m "Your message"
git push origin main

# Redeploy frontend
cd frontend
vercel --prod

# View Railway logs
# Visit: railway.app → Your project → Deployments

# View Vercel logs
# Visit: vercel.com/dashboard → Your project → Deployments
```

---

## ✨ You're Done!

**Congratulations! Your LearnQuest Studio is now live! 🎉**

**Share your app:**
- Frontend: `https://your-app.vercel.app`
- API Docs: `https://your-backend.railway.app/api`

**Next steps:**
- Create sample games
- Invite users
- Monitor analytics
- Scale as needed!

---

**Need help?** Check:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md) - Checklist format
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
