# LearnQuest Studio - Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **PostgreSQL** >= 14 ([Download](https://www.postgresql.org/download/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** (for version control)

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE learnquest;
```

Or using command line:

```bash
createdb learnquest
```

### 3. Environment Configuration

#### Frontend Environment

Create `frontend/.env` file:

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api

# Firebase Configuration (get from Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend Environment

Create `backend/.env` file:

```bash
cd ../backend
cp .env.example .env
```

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=learnquest

# JWT
JWT_SECRET=your-secret-key-change-this-in-production

# Firebase Admin (get from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# OpenAI
OPENAI_API_KEY=your-openai-api-key-here

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Authentication** > **Sign-in method** > Enable Email/Password and Google
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" > Web app
   - Copy the config values to `frontend/.env`
5. Get Firebase Admin SDK credentials:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Copy the values to `backend/.env`

### 5. Run the Application

#### Option 1: Run Everything Together

From the root directory:

```bash
npm run dev
```

This will start both frontend and backend concurrently.

#### Option 2: Run Separately

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

### 6. Access the Application

- **Frontend (Player App):** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Admin Panel:** http://localhost:5173/admin/login

## Database Migration

The database schema is automatically synchronized in development mode. For production, you'll need to run migrations:

```bash
cd backend
npm run migration:generate -- -n InitialSchema
npm run migration:run
```

## Testing the Setup

### 1. Test Backend API

Visit http://localhost:3000/api/games - should return an empty array `[]`

### 2. Test Frontend

Visit http://localhost:5173 - should show the home page

### 3. Test Admin Login

1. Create an admin user in Firebase Console
2. Go to http://localhost:5173/admin/login
3. Login with your credentials

## Project Structure

```
learnquest-studio/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management (Zustand)
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── entities/      # Database entities
│   │   ├── common/        # Shared resources
│   │   └── main.ts        # Entry point
│   └── package.json
│
└── package.json           # Root package.json
```

## Common Issues & Solutions

### Issue: Port already in use

**Solution:** Change the port in the respective .env file:
- Frontend: `VITE_PORT=5174`
- Backend: `PORT=3001`

### Issue: Database connection failed

**Solution:**
1. Ensure PostgreSQL is running: `pg_ctl status`
2. Check credentials in `backend/.env`
3. Verify database exists: `psql -l`

### Issue: Firebase authentication not working

**Solution:**
1. Verify Firebase config in `frontend/.env`
2. Check Firebase Admin credentials in `backend/.env`
3. Ensure Authentication is enabled in Firebase Console

### Issue: OpenAI API calls failing

**Solution:**
1. Verify API key in `backend/.env`
2. Check API usage limits in OpenAI dashboard
3. Ensure you have sufficient credits

## Development Commands

### Root Level
```bash
npm run dev              # Run both frontend and backend
npm run build            # Build both
npm run install:all      # Install all dependencies
```

### Frontend
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Backend
```bash
npm run start:dev        # Start with hot reload
npm run build            # Build
npm run start:prod       # Start production server
npm run lint             # Lint code
```

## Next Steps

1. **Create Your First Game:**
   - Login to admin panel
   - Click "New Game"
   - Add levels and challenges
   - Publish the game

2. **Test AI Features:**
   - Use the question generator in admin panel
   - Generate questions from topics or images
   - Preview and edit generated content

3. **Customize:**
   - Modify theme colors in `frontend/tailwind.config.js`
   - Add custom mini-games in `frontend/src/games/`
   - Extend API with new endpoints in `backend/src/modules/`

## Production Deployment

For production deployment guides:
- Frontend: Vercel, Netlify, or AWS S3
- Backend: AWS EC2, Heroku, or DigitalOcean
- Database: AWS RDS, Heroku Postgres, or DigitalOcean Managed Database

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Support

For issues or questions:
- Check the [documentation](./docs/)
- Review [common issues](#common-issues--solutions)
- Open an issue on GitHub

## License

Proprietary - All rights reserved
