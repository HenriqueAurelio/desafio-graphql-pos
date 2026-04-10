import { createContext, useContext } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthContextValue {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}
