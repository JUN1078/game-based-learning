# ⚡ Quick Start - Run Locally NOW!

## ✅ What's Already Done

- ✅ Node.js v20.15.1 installed
- ✅ npm v10.7.0 installed
- ✅ All dependencies installed (3,279 packages)
- ✅ Environment files created

## 🔴 What You Need to Do

### 1. Install PostgreSQL (5 minutes)

**Choose ONE option:**

**Option A: Download & Install (Recommended)**
```
1. Download: https://www.postgresql.org/download/windows/
2. Run installer (PostgreSQL 14 or higher)
3. During setup:
   - Port: 5432 (default)
   - Password: postgres (or remember what you set)
   - Locale: Default
4. Finish installation
```

**Option B: Use Docker (if you have it)**
```bash
docker run --name learnquest-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14
```

### 2. Create Database (30 seconds)

**After PostgreSQL is installed:**

```bash
# Open Command Prompt or PowerShell
# Create the database
createdb -U postgres learnquest

# If prompted for password, enter the one you set during installation
```

**Or use SQL:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE learnquest;

# Exit
\q
```

### 3. Configure Firebase (5 minutes)

**You need a Firebase project for authentication:**

1. **Go to [Firebase Console](https://console.firebase.google.com)**

2. **Create or select a project**

3. **Enable Authentication:**
   - Click "Authentication" → "Get Started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password"
   - (Optional) Enable "Google"

4. **Get Frontend Config:**
   - Click gear icon → "Project settings"
   - Scroll to "Your apps"
   - Click "</>" (Web) to add/view web app
   - Copy the config values

5. **Update `frontend/.env`:**
   ```bash
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
   ```

6. **Get Backend Config (Service Account):**
   - Project Settings → "Service Accounts" tab
   - Click "Generate new private key"
   - Download the JSON file

7. **Update `backend/.env`:**
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

**⚠️ IMPORTANT:** Keep the quotes and `\n` in the FIREBASE_PRIVATE_KEY

### 4. Run the Application! (30 seconds)

```bash
# From project root
npm run dev
```

**This will start:**
- ✅ Backend on http://localhost:3000
- ✅ Frontend on http://localhost:5173

## 🎯 Access Your Application

**Frontend (Player & Admin):**
- http://localhost:5173

**Backend API:**
- http://localhost:3000/api

**Admin Panel:**
- http://localhost:5173/admin/login

## 🧪 Test Everything Works

### 1. Test Backend
```bash
# Open browser or new terminal
curl http://localhost:3000/api/games

# Should return: []
```

### 2. Test Frontend
- Open http://localhost:5173
- Should see "LearnQuest Studio" home page
- No console errors (press F12)

### 3. Test Authentication
- Go to http://localhost:5173/admin/login
- Try to sign up with Firebase

## 🔧 Troubleshooting

### PostgreSQL not found
```bash
# Make sure you added PostgreSQL to PATH during installation
# Or find psql.exe and run it directly:
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres

# Create database
CREATE DATABASE learnquest;
\q
```

### Port 3000 already in use
```bash
# Find and kill the process
netstat -ano | findstr :3000

# Change port in backend/.env
PORT=3001
```

### Port 5173 already in use
```bash
# Kill the process or change port in frontend/vite.config.ts
```

### Can't connect to database
**Check backend/.env:**
- DB_PASSWORD matches what you set during PostgreSQL installation
- DB_DATABASE=learnquest
- DB_HOST=localhost
- DB_PORT=5432

## 📝 Quick Commands

```bash
# Run everything
npm run dev

# Run backend only
cd backend && npm run start:dev

# Run frontend only
cd frontend && npm run dev

# View database
psql -U postgres -d learnquest

# List tables
\dt

# View all games
SELECT * FROM games;
```

## 🎓 What's Next?

Once everything is running:

1. **Create admin user** - Sign up via admin login
2. **Create first game** - Use admin panel
3. **Add levels** - Create 2-3 levels
4. **Add challenges** - Text, quiz, mini-game
5. **Test AI** - Generate questions with AI
6. **Play the game** - Test as player

## 📚 Full Documentation

- **Detailed Setup**: [LOCAL_SETUP.md](LOCAL_SETUP.md)
- **User Guide**: [USER_GUIDE.md](USER_GUIDE.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## ⏱️ Time to Get Running

- PostgreSQL install: 5 minutes
- Database setup: 30 seconds
- Firebase config: 5 minutes
- **Total: ~10 minutes**

---

**🚀 Ready? Let's do this!**

1. Install PostgreSQL
2. Create database
3. Configure Firebase
4. Run `npm run dev`
5. Open http://localhost:5173

**You got this! 💪**
