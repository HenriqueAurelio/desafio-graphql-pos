import { useMutation } from '@apollo/client/react'
import { z } from 'zod'
import { REGISTER_MUTATION } from '@/graphql/mutations/auth'
import type { AuthUser } from '@/contexts/useAuth'

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterMutationData {
  register: {
    token: string
    refreshToken: string
    user: AuthUser
  }
}

interface RegisterMutationVariables {
  data: {
    name: string
    email: string
    password: string
  }
}

export function useRegister() {
  const [registerMutation, { loading, error }] = useMutation<
    RegisterMutationData,
    RegisterMutationVariables
  >(REGISTER_MUTATION)

  async function register(data: RegisterFormData) {
    try {
      return await registerMutation({
        variables: { data: { name: data.name, email: data.email, password: data.password } },
      })
    } catch {
      return { data: undefined }
    }
  }

  return { register, loading, error }
}
