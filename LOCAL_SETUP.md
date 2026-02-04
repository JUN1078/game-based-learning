# 🖥️ Local Setup Guide - LearnQuest Studio

Complete guide to run LearnQuest Studio on your local machine.

---

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up database
createdb learnquest

# 3. Configure environment variables
# Copy .env.example files and fill in values

# 4. Run the application
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

---

## 📋 Prerequisites

### Required Software

- ✅ **Node.js** >= 18.0.0
- ✅ **PostgreSQL** >= 14
- ✅ **npm** >= 9.0.0
- ✅ **Git** (for version control)

### Check Installations

```bash
# Check Node.js version
node --version
# Should be >= v18.0.0

# Check npm version
npm --version
# Should be >= 9.0.0

# Check PostgreSQL
psql --version
# Should be >= 14

# Check if PostgreSQL is running
# Windows:
sc query postgresql-x64-14

# Mac/Linux:
pg_isready
```

---

## 📦 Step 1: Install Dependencies

### Install All at Once (Recommended)

```bash
# From project root
npm run install:all
```

This will install dependencies for:
- Root project
- Frontend (React + Vite)
- Backend (NestJS)

### Or Install Separately

```bash
# Root dependencies
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

**Expected output:**
```
✓ Root: 1 package installed
✓ Frontend: ~50 packages installed
✓ Backend: ~80 packages installed
```

---

## 🗄️ Step 2: Set Up PostgreSQL Database

### Create Database

**Method 1: Command Line (Easiest)**
```bash
# Create database
createdb learnquest

# Verify it was created
psql -l | grep learnquest
```

**Method 2: SQL Command**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE learnquest;

# Exit
\q
```

**Method 3: pgAdmin**
1. Open pgAdmin
2. Right-click "Databases"
3. Create → Database
4. Name: `learnquest`
5. Click Save

### Verify Database

```bash
# Connect to the database
psql -d learnquest

# Should show:
# learnquest=#

# Exit
\q
```

---

## 🔧 Step 3: Configure Environment Variables

### Backend Environment

```bash
# Navigate to backend folder
cd backend

# Copy example file
copy .env.example .env     # Windows
# or
cp .env.example .env       # Mac/Linux
```

**Edit `backend/.env`:**

```bash
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=learnquest

# JWT Secret (any random string for dev)
JWT_SECRET=dev-secret-key-change-in-production

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\n-----END PRIVATE KEY-----\n"

# OpenAI API Key (Already provided)
OPENAI_API_KEY=your-openai-api-key-here

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment

```bash
# Navigate to frontend folder
cd ../frontend

# Copy example file
copy .env.example .env     # Windows
# or
cp .env.example .env       # Mac/Linux
```

**Edit `frontend/.env`:**

```bash
# API URL
VITE_API_URL=http://localhost:3000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### Get Firebase Configuration

**If you don't have Firebase set up yet:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or use existing
3. **For Frontend Config:**
   - Project Settings → General
   - Scroll to "Your apps"
   - Add web app or select existing
   - Copy config values

4. **For Backend Config:**
   - Project Settings → Service Accounts
   - Generate new private key
   - Download JSON file
   - Copy values to `.env`

5. **Enable Authentication:**
   - Firebase Console → Authentication
   - Get Started
   - Sign-in method → Enable "Email/Password"
   - (Optional) Enable "Google"

---

## 🚀 Step 4: Run the Application

### Option 1: Run Everything (Recommended)

```bash
# From project root
npm run dev
```

This starts both frontend and backend concurrently.

**Expected output:**
```
[frontend] VITE v5.0.8 ready in 523 ms
[frontend] ➜  Local:   http://localhost:5173/
[backend] [Nest] 12345  - LOG [NestFactory] Starting Nest application...
[backend] 🚀 Server running on http://localhost:3000
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Verify It's Running

**Backend Health Check:**
```bash
# Open browser or use curl
curl http://localhost:3000/api

# Should return something (even 404 is OK - means it's running)
```

**Frontend:**
- Open browser: http://localhost:5173
- Should see LearnQuest Studio home page

---

## ✅ Step 5: Test the Setup

### Create Your First Admin User

1. **Go to Admin Login:**
   - http://localhost:5173/admin/login

2. **Sign Up with Email:**
   - Use Firebase Authentication
   - Or create user in Firebase Console

3. **Set Admin Role:**
   - Update user in database or Firebase

### Test Key Features

**Test Backend API:**
```bash
# Get all games (should return empty array)
curl http://localhost:3000/api/games

# Response: []
```

**Test Frontend:**
- [ ] Home page loads
- [ ] Can navigate to admin login
- [ ] No console errors

**Test AI Features (Optional):**
- Login to admin
- Try AI question generation
- Should work with provided OpenAI key

---

## 🔍 Troubleshooting

### Database Connection Issues

**Error: `ECONNREFUSED` or `password authentication failed`**

```bash
# Check if PostgreSQL is running
# Windows:
sc query postgresql-x64-14

# Mac:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql

# Start PostgreSQL if not running
# Windows:
sc start postgresql-x64-14

# Mac:
brew services start postgresql

# Linux:
sudo systemctl start postgresql
```

**Fix password issues:**
```bash
# Reset postgres password
# Connect as postgres user
psql -U postgres

# Set new password
ALTER USER postgres WITH PASSWORD 'your_new_password';

# Update backend/.env with new password
```

### Port Already in Use

**Error: `Port 3000 is already in use`**

```bash
# Find what's using the port
# Windows:
netstat -ano | findstr :3000

# Mac/Linux:
lsof -i :3000

# Kill the process or change port in backend/.env
```

**Error: `Port 5173 is already in use`**

```bash
# Kill process using port 5173 or
# Change port in frontend/vite.config.ts
```

### Firebase Authentication Not Working

**Check:**
- [ ] Firebase config in `frontend/.env` is correct
- [ ] Firebase project has Authentication enabled
- [ ] Email/Password sign-in method is enabled
- [ ] No typos in environment variables

**Test Firebase connection:**
```javascript
// In browser console on frontend
console.log(import.meta.env)
// Should show your VITE_FIREBASE_* variables
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules
npm install

cd ../backend
rm -rf node_modules
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
cd backend
npm run build

cd ../frontend
npm run build
```

### OpenAI API Not Working

**Error: `Invalid API key`**
- Verify `OPENAI_API_KEY` in `backend/.env`
- Check API key is active in OpenAI dashboard
- Ensure you have credits/billing enabled

---

## 🛠️ Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript
- Auto Rename Tag
- Path Intellisense
- GitLens

### Database Tools

- **pgAdmin** - GUI for PostgreSQL
- **DBeaver** - Universal database tool
- **Postico** (Mac) - PostgreSQL client

### API Testing

- **Thunder Client** (VS Code extension)
- **Postman**
- **curl** (command line)

---

## 📊 Database Management

### View Database Tables

```bash
# Connect to database
psql -d learnquest

# List tables
\dt

# View table structure
\d users
\d games
\d levels

# Query data
SELECT * FROM users;
SELECT * FROM games;

# Exit
\q
```

### Reset Database (if needed)

```bash
# Drop and recreate database
dropdb learnquest
createdb learnquest

# Restart backend (will auto-create tables in dev mode)
cd backend
npm run start:dev
```

---

## 🔄 Common Development Tasks

### Add Sample Data

**Create a test game:**
1. Login to admin panel
2. Click "New Game"
3. Fill in details
4. Add levels and challenges

**Or use SQL:**
```sql
-- Connect to database
psql -d learnquest

-- Insert sample game
INSERT INTO games (id, title, description, status, difficulty, "createdBy", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Test Game',
  'A test learning game',
  'published',
  'medium',
  'admin-user-id',
  NOW(),
  NOW()
);
```

### Clear All Data

```bash
# Connect to database
psql -d learnquest

# Delete all data (keeps tables)
TRUNCATE TABLE game_attempts CASCADE;
TRUNCATE TABLE challenges CASCADE;
TRUNCATE TABLE levels CASCADE;
TRUNCATE TABLE games CASCADE;
TRUNCATE TABLE users CASCADE;

# Exit
\q
```

### View Logs

**Backend logs:**
- Check terminal where backend is running
- Logs show SQL queries in development mode

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab

---

## 📝 Environment Variables Reference

### Backend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment | `development` |
| `PORT` | Yes | Server port | `3000` |
| `DB_HOST` | Yes | Database host | `localhost` |
| `DB_PORT` | Yes | Database port | `5432` |
| `DB_USERNAME` | Yes | DB username | `postgres` |
| `DB_PASSWORD` | Yes | DB password | `password` |
| `DB_DATABASE` | Yes | Database name | `learnquest` |
| `JWT_SECRET` | Yes | JWT secret | `dev-secret-key` |
| `FIREBASE_PROJECT_ID` | Yes | Firebase project ID | `my-project` |
| `FIREBASE_CLIENT_EMAIL` | Yes | Firebase service account email | `firebase-adminsdk@...` |
| `FIREBASE_PRIVATE_KEY` | Yes | Firebase private key | `"-----BEGIN..."` |
| `OPENAI_API_KEY` | Yes | OpenAI API key | `sk-proj-...` |
| `CORS_ORIGIN` | Yes | Allowed origin | `http://localhost:5173` |

### Frontend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `http://localhost:3000/api` |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase API key | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain | `my-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID | `my-project` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage | `my-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase sender ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID | `1:123...` |

---

## 🎯 Next Steps After Setup

1. **Create Admin User** - Set up Firebase authentication
2. **Create First Game** - Use admin panel to create a test game
3. **Add Levels** - Create 2-3 levels with different challenge types
4. **Test AI Generation** - Use AI to generate questions
5. **Play the Game** - Test as a player
6. **Try Mini-Game** - Add and play the Endless Run game

---

## 📞 Getting Help

### Still Having Issues?

1. **Check the logs** - Look for error messages
2. **Verify environment variables** - Common source of issues
3. **Check database connection** - Ensure PostgreSQL is running
4. **Review setup steps** - Did you miss anything?

### Common Solutions

**Nothing works:**
```bash
# Nuclear option - full reset
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
npm run install:all
```

**Database issues:**
```bash
# Recreate database
dropdb learnquest
createdb learnquest
```

**Can't access Firebase:**
- Double-check all Firebase environment variables
- Ensure Firebase project exists
- Verify Authentication is enabled

---

## ✅ Setup Complete Checklist

- [ ] Node.js installed (>= 18.0.0)
- [ ] PostgreSQL installed and running
- [ ] Dependencies installed (`npm run install:all`)
- [ ] Database created (`learnquest`)
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Firebase project set up
- [ ] Backend running (http://localhost:3000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Can access home page
- [ ] Can access admin login
- [ ] No console errors

---

**🎉 You're ready to develop!**

Happy coding! 🚀
