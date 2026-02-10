// User Types
export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: 'player' | 'admin'
  gender?: string
  dateOfBirth?: string
  heightCm?: number
  weightKg?: number
  goal?: string
  preferredUnits?: 'metric' | 'imperial'
  createdAt: Date
}

// Game Types
export interface Game {
  id: string
  title: string
  description: string
  thumbnail?: string
  status: 'draft' | 'published' | 'archived'
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedDuration: number // minutes
  totalLevels: number
  learningObjectives: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// Level Types
export interface Level {
  id: string
  gameId: string
  order: number
  title: string
  description?: string
  difficulty: 'easy' | 'medium' | 'hard'
  challenges: Challenge[]
  passingScore: number
  createdAt: Date
}

// Challenge Types
export type ChallengeType =
  | 'text'
  | 'image'
  | 'video'
  | 'quiz'
  | 'scenario'
  | 'crossword'
  | 'true-false'
  | 'sorting'
  | 'guess-word'
  | 'mini-game'

export interface Challenge {
  id: string
  levelId: string
  type: ChallengeType
  order: number
  config: ChallengeConfig
  points: number
}

export interface ChallengeConfig {
  // Text/Image/Video
  content?: string
  imageUrl?: string
  videoUrl?: string

  // Quiz
  question?: string
  options?: string[]
  correctAnswer?: string | number
  explanation?: string

  // Mini-game
  gameType?: 'endless-run' | 'match3' | 'memory-flip' | 'toon' | 'puzzle-grid'
  gameConfig?: Record<string, any>

  // Common
  timeLimit?: number // seconds
  attempts?: number
}

// Question Types for AI Generation
export interface AIGeneratedQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  metadata?: {
    prompt: string
    model: string
    temperature: number
    createdAt: Date
  }
}

// Attempt/Progress Types
export interface GameAttempt {
  id: string
  userId: string
  gameId: string
  score: number
  maxScore: number
  duration: number // seconds
  completedLevels: number
  totalLevels: number
  status: 'in-progress' | 'completed' | 'abandoned'
  startedAt: Date
  completedAt?: Date
}

export interface LevelAttempt {
  id: string
  attemptId: string
  levelId: string
  score: number
  maxScore: number
  accuracy: number // percentage
  duration: number
  attempts: number
  completedAt: Date
}

// Ranking/Leaderboard
export interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  userPhoto?: string
  score: number
  completionTime: number
  accuracy: number
  badge?: string
}

// Analytics
export interface GameAnalytics {
  gameId: string
  totalAttempts: number
  completionRate: number
  averageScore: number
  averageDuration: number
  dropOffLevel: number
  levelStats: LevelStats[]
}

export interface LevelStats {
  levelId: number
  attempts: number
  completionRate: number
  averageScore: number
  averageAccuracy: number
  averageTime: number
}

// Asset Types
export interface Asset {
  id: string
  type: 'image' | 'audio' | 'video' | 'sprite'
  url: string
  name: string
  tags: string[]
  aiGenerated: boolean
  createdAt: Date
}

// AI Generation Request
export interface AIGenerationRequest {
  type: 'question' | 'character' | 'background' | 'icon'
  prompt?: string
  topic?: string
  difficulty?: string
  imageUrl?: string
  count?: number
  options?: {
    temperature?: number
    maxTokens?: number
    model?: string
  }
}

// Energy Management Types
export interface FoodLog {
  id: string
  foodName: string
  portion?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  confidenceScore: number
  createdAt: Date
}

export interface InBodyReport {
  id: string
  weight: number
  skeletalMuscleMass?: number
  bodyFatMass?: number
  bodyFatPercent?: number
  fatFreeMass?: number
  totalBodyWater?: number
  bmr?: number
  visceralFat?: number
  ecwRatio?: number
  createdAt: Date
}

export interface CorosUpload {
  id: string
  activeCalories: number
  trainingLoad?: number
  durationMinutes?: number
  avgHr?: number
  maxHr?: number
  recoveryStatus?: string
  createdAt: Date
}

export interface DailyEnergySummary {
  date: string
  bmr: number
  activeCalories: number
  neatAdjustment: number
  recoveryModifier: number
  dailyEnergyNeed: number
  caloriesEaten: number
  macros: {
    protein: number
    fat: number
    carbs: number
  }
  coaching?: {
    summary: string
    warning?: string | null
  }
}

export interface WeeklyEnergySummary {
  startDate: string
  endDate: string
  averageEnergyNeed: number
  averageCaloriesEaten: number
  days: DailyEnergySummary[]
  coaching?: {
    summary: string
    warning?: string | null
  }
}
