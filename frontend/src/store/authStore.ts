import { create } from 'zustand'
import { User } from '@/types'
import { authApi } from '@services/api'

interface AuthState {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  token: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setToken: (token: string | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (payload: {
    email: string
    password: string
    displayName: string
    gender?: string
    dateOfBirth?: string
    heightCm?: number
    weightKg?: number
    goal?: string
    preferredUnits?: 'metric' | 'imperial'
  }) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  isLoading: true,
  token: localStorage.getItem('authToken'),

  setUser: (user) =>
    set({
      user,
      isAdmin: user?.role === 'admin',
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
    set({ token })
  },

  login: async (email, password) => {
    const response = await authApi.login({ email, password })
    localStorage.setItem('authToken', response.data.accessToken)
    set({
      token: response.data.accessToken,
      user: response.data.user,
      isAdmin: response.data.user.role === 'admin',
      isLoading: false,
    })
  },

  register: async (payload) => {
    const response = await authApi.register(payload)
    localStorage.setItem('authToken', response.data.accessToken)
    set({
      token: response.data.accessToken,
      user: response.data.user,
      isAdmin: response.data.user.role === 'admin',
      isLoading: false,
    })
  },

  logout: () => {
    localStorage.removeItem('authToken')
    set({
      user: null,
      isAdmin: false,
      isLoading: false,
      token: null,
    })
  },
}))
