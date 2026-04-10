import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { apolloClient } from '@/lib/apollo'
import { GET_ME } from '@/graphql/queries/user'
import { AuthContext, type AuthUser } from './useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u)
  }, [])

  useEffect(() => {
    for (const k of ['financy_token', 'financy_user']) {
      localStorage.removeItem(k)
      sessionStorage.removeItem(k)
    }

    apolloClient
      .query<{ me: AuthUser }>({ query: GET_ME, fetchPolicy: 'network-only' })
      .then(({ data }) => setUserState(data?.me ?? null))
      .catch(() => setUserState(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
