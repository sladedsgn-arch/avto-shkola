import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/db/types'

interface AuthState {
  user: User | null
  lastActiveDate: string | null
  setUser: (user: User | null) => void
  updateUser: (patch: Partial<User>) => void
  setLastActiveDate: (date: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      lastActiveDate: null,
      setUser: (user) => set({ user }),
      updateUser: (patch) => set(state => ({
        user: state.user ? { ...state.user, ...patch } : null
      })),
      setLastActiveDate: (date) => set({ lastActiveDate: date }),
      logout: () => set({ user: null, lastActiveDate: null })
    }),
    { name: 'auth-store' }
  )
)
