# LearnQuest Studio

A comprehensive game-based learning platform that enables educators and organizations to create interactive learning journeys without coding.

## Features

- **Player App**: Interactive game launcher with mini-games, quizzes, and progress tracking
- **Admin CMS**: Complete content management system for creating games, levels, and challenges
- **AI-Powered**: OpenAI integration for automatic question and asset generation
- **Mini-Games**: Built with Phaser.js (Endless Run, Match3, Memory Flip, and more)
- **Analytics**: Comprehensive dashboard for tracking learner progress and performance
- **Gamification**: Scoring, ranking, badges, and rewards system

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- MagicUI
- Phaser.js (game engine)
- Framer Motion (animations)

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Firebase Auth

### AI Services
- OpenAI GPT-4 (question generation)
- OpenAI Vision (image-based questions)

## Project Structure

```
learnquest-studio/
├── frontend/          # React frontend application
├── backend/           # NestJS backend API
├── shared/            # Shared types and utilities
└── docs/              # Documentation
```

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9.0.0

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend
   - Configure database, Firebase, and OpenAI credentials

4. Run migrations:
```bash
cd backend && npm run migration:run
```

5. Start development servers:
```bash
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

## Development

- `npm run dev` - Start both frontend and backend
- `npm run build` - Build production bundles
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only

## Architecture

### Learning Journey Flow
```
Introduction → Level 1 → Level 2 → ... → End/Result
```

Each level can contain:
- Text/Image/Video content
- Quizzes (MCQ, True/False, Open-ended)
- Scenarios
- Mini-games
- Interactive challenges

### Mini-Game Types
- **Endless Run**: Dodge obstacles while answering questions
- **Match3**: Match items related to learning concepts
- **Memory Flip**: Pair matching for concept reinforcement
- **Toon**: Arcade-style reflex challenges
- **Puzzle Grid**: Logic-based arrangement puzzles

## Documentation

See the [docs](./docs) folder for detailed documentation:
- API Documentation
- Database Schema
- Component Guide
- Animation Guidelines
- AI Integration Guide

## Deployment

### Deploy to Production

LearnQuest Studio is configured for deployment to:
- **Frontend**: Vercel (automatic CDN, HTTPS, global edge)
- **Backend**: Railway (Node.js, PostgreSQL, auto-scaling)

#### Quick Deploy (3 Steps)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy Backend to Railway**
   - Go to [railway.app](https://railway.app)
   - Create project from GitHub
   - Add PostgreSQL database
   - Set environment variables

3. **Deploy Frontend to Vercel**
   ```bash
   cd frontend && vercel
   ```

#### Deployment Guides

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** - Quick deployment checklist
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Deployment overview

#### Helper Scripts

```bash
# Use deployment helper
./deploy.sh        # Mac/Linux
deploy.bat         # Windows
```

#### Estimated Time: 30-45 minutes
#### Cost: Free tier available (Vercel + Railway free trials)

## License

Proprietary - All rights reserved
