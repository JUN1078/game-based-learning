import { create } from 'zustand'
import { Game, Level, Challenge, GameAttempt } from '@/types'

interface GameState {
  // Current game data
  currentGame: Game | null
  currentLevel: Level | null
  currentChallenge: Challenge | null
  currentAttempt: GameAttempt | null

  // Progress
  score: number
  completedChallenges: string[]
  levelProgress: number

  // Actions
  setCurrentGame: (game: Game | null) => void
  setCurrentLevel: (level: Level | null) => void
  setCurrentChallenge: (challenge: Challenge | null) => void
  setCurrentAttempt: (attempt: GameAttempt | null) => void
  addScore: (points: number) => void
  completeChallenge: (challengeId: string) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,
  currentLevel: null,
  currentChallenge: null,
  currentAttempt: null,
  score: 0,
  completedChallenges: [],
  levelProgress: 0,

  setCurrentGame: (game) => set({ currentGame: game }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
  setCurrentAttempt: (attempt) => set({ currentAttempt: attempt }),

  addScore: (points) =>
    set((state) => ({
      score: state.score + points,
    })),

  completeChallenge: (challengeId) =>
    set((state) => ({
      completedChallenges: [...state.completedChallenges, challengeId],
    })),

  resetGame: () =>
    set({
      currentGame: null,
      currentLevel: null,
      currentChallenge: null,
      currentAttempt: null,
      score: 0,
      completedChallenges: [],
      levelProgress: 0,
    }),
}))
