import type { ApolloError } from '@apollo/client/core'

const GQL_ERROR_MAP: Record<string, string> = {
  'User not registered': 'Usuário não encontrado.',
  'User already exists': 'Este e-mail já está em uso.',
  'Invalid Login': 'Dados inválidos.',
  'Unauthorized': 'Sessão expirada. Faça login novamente.',
}

export function getErrorMessage(error: ApolloError | undefined): string | null {
  if (!error) return null

  if (error.networkError) {
    return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
  }

  const raw = error.graphQLErrors?.[0]?.message ?? error.message
  for (const [key, translated] of Object.entries(GQL_ERROR_MAP)) {
    if (raw.includes(key)) return translated
  }

  return raw
}
