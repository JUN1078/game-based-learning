import axios from 'axios'
import {
  Game,
  Level,
  Challenge,
  GameAttempt,
  AIGenerationRequest,
  AIGeneratedQuestion,
  DailyEnergySummary,
  WeeklyEnergySummary,
  FoodLog,
  InBodyReport,
  CorosUpload,
  User,
} from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Game API
export const gameApi = {
  getAll: () => api.get<Game[]>('/games'),
  getById: (id: string) => api.get<Game>(`/games/${id}`),
  create: (data: Partial<Game>) => api.post<Game>('/games', data),
  update: (id: string, data: Partial<Game>) => api.put<Game>(`/games/${id}`, data),
  delete: (id: string) => api.delete(`/games/${id}`),
  publish: (id: string) => api.patch<Game>(`/games/${id}/publish`),
  duplicate: (id: string) => api.post<Game>(`/games/${id}/duplicate`),
}

// Level API
export const levelApi = {
  getByGameId: (gameId: string) => api.get<Level[]>(`/games/${gameId}/levels`),
  getById: (id: string) => api.get<Level>(`/levels/${id}`),
  create: (gameId: string, data: Partial<Level>) =>
    api.post<Level>(`/games/${gameId}/levels`, data),
  update: (id: string, data: Partial<Level>) => api.put<Level>(`/levels/${id}`, data),
  delete: (id: string) => api.delete(`/levels/${id}`),
  reorder: (gameId: string, levelIds: string[]) =>
    api.patch(`/games/${gameId}/levels/reorder`, { levelIds }),
}

// Challenge API
export const challengeApi = {
  getByLevelId: (levelId: string) => api.get<Challenge[]>(`/levels/${levelId}/challenges`),
  create: (levelId: string, data: Partial<Challenge>) =>
    api.post<Challenge>(`/levels/${levelId}/challenges`, data),
  update: (id: string, data: Partial<Challenge>) => api.put<Challenge>(`/challenges/${id}`, data),
  delete: (id: string) => api.delete(`/challenges/${id}`),
}

// Attempt API
export const attemptApi = {
  start: (gameId: string) => api.post<GameAttempt>(`/games/${gameId}/attempts`),
  update: (id: string, data: Partial<GameAttempt>) =>
    api.put<GameAttempt>(`/attempts/${id}`, data),
  complete: (id: string, score: number) =>
    api.patch<GameAttempt>(`/attempts/${id}/complete`, { score }),
  getByUser: (userId: string) => api.get<GameAttempt[]>(`/users/${userId}/attempts`),
}

// AI API
export const aiApi = {
  generateQuestions: (request: AIGenerationRequest) =>
    api.post<{ questions: AIGeneratedQuestion[] }>('/ai/generate-questions', request),
  generateAsset: (request: AIGenerationRequest) =>
    api.post<{ url: string }>('/ai/generate-asset', request),
}

// Analytics API
export const analyticsApi = {
  getGameAnalytics: (gameId: string) => api.get(`/analytics/games/${gameId}`),
  getLevelAnalytics: (levelId: string) => api.get(`/analytics/levels/${levelId}`),
  getLeaderboard: (gameId: string, limit = 10) =>
    api.get(`/games/${gameId}/leaderboard`, { params: { limit } }),
}

// Energy Management API
export const authApi = {
  register: (data: {
    email: string
    password: string
    displayName: string
    gender?: string
    dateOfBirth?: string
    heightCm?: number
    weightKg?: number
    goal?: string
    preferredUnits?: 'metric' | 'imperial'
  }) => api.post<{ accessToken: string; user: User }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ accessToken: string; user: User }>('/auth/login', data),
  me: () => api.get<User>('/auth/me'),
  updateProfile: (data: Partial<User>) => api.patch<User>('/auth/profile', data),
}

export const energyApi = {
  getDaily: (params?: { date?: string; neatAdjustment?: number; recoveryModifier?: number }) =>
    api.get<DailyEnergySummary>('/daily/energy', { params }),
  getWeekly: (params?: { date?: string }) =>
    api.get<WeeklyEnergySummary>('/weekly/summary', { params }),
}

export const foodApi = {
  log: (data: {
    items?: Array<{
      foodName: string
      portion?: string
      calories: number
      protein?: number
      carbs?: number
      fat?: number
      confidenceScore?: number
    }>
    rawText?: string
    imageUrl?: string
  }) => api.post<{ saved?: FoodLog[]; parsed?: any; needsConfirmation?: boolean }>('/food/log', data),
  list: () => api.get<FoodLog[]>('/food/logs'),
}

export const inBodyApi = {
  upload: (data: {
    weight?: number
    skeletalMuscleMass?: number
    bodyFatMass?: number
    bodyFatPercent?: number
    fatFreeMass?: number
    totalBodyWater?: number
    bmr?: number
    visceralFat?: number
    ecwRatio?: number
    rawText?: string
    imageUrl?: string
  }) => api.post<{ saved?: InBodyReport; parsed?: any; needsConfirmation?: boolean }>('/inbody/upload', data),
  latest: () => api.get<InBodyReport>('/inbody/latest'),
  history: (limit = 20) => api.get<InBodyReport[]>('/inbody/history', { params: { limit } }),
}

export const corosApi = {
  upload: (data: {
    activeCalories?: number
    trainingLoad?: number
    durationMinutes?: number
    avgHr?: number
    maxHr?: number
    recoveryStatus?: string
    rawText?: string
    imageUrl?: string
  }) => api.post<{ saved?: CorosUpload; parsed?: any; needsConfirmation?: boolean }>('/coros/upload', data),
  history: (limit = 20) => api.get<CorosUpload[]>('/coros/history', { params: { limit } }),
}

export default api
