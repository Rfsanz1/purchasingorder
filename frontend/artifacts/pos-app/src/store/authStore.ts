import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  username: string
  role: string
  role_label: string
  permissions: string[]
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  hasPermission: (perm: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('pos_token', token)
        set({ user, token })
      },
      logout: () => {
        localStorage.removeItem('pos_token')
        localStorage.removeItem('pos_user')
        set({ user: null, token: null })
      },
      hasPermission: (perm) => {
        const { user } = get()
        if (!user) return false
        if (user.role === 'owner' || user.role === 'admin') return true
        return user.permissions.includes(perm)
      },
    }),
    { name: 'pos_auth' },
  ),
)
