import { useMutation } from '@apollo/client/react'
import { z } from 'zod'
import { LOGIN_MUTATION } from '@/graphql/mutations/auth'
import { useAuth, type AuthUser } from '@/contexts/useAuth'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  rememberMe: z.boolean(),
})

export type LoginFormData = z.infer<typeof loginSchema>

interface LoginMutationData {
  login: {
    token: string
    refreshToken: string
    user: AuthUser
  }
}

interface LoginMutationVariables {
  data: {
    email: string
    password: string
  }
}

export function useLogin() {
  const { setUser } = useAuth()
  const [loginMutation, { loading, error }] = useMutation<
    LoginMutationData,
    LoginMutationVariables
  >(LOGIN_MUTATION)

  async function login(data: LoginFormData) {
    try {
      const result = await loginMutation({
        variables: { data: { email: data.email, password: data.password } },
      })
      if (result.data) {
        setUser(result.data.login.user)
      }
      return result
    } catch {
      return { data: undefined }
    }
  }

  return { login, loading, error }
}
