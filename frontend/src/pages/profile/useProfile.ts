import { useMutation } from '@apollo/client/react'
import { UPDATE_USER } from '@/graphql/mutations/user'
import { useAuth } from '@/contexts/useAuth'

interface UpdateUserData {
  updateUser: {
    id: string
    name: string
    email: string
  }
}

export function useProfile() {
  const { user, setUser } = useAuth()

  const [updateMutation, { loading: saving, error }] = useMutation<UpdateUserData>(UPDATE_USER)

  async function updateName(name: string) {
    const result = await updateMutation({ variables: { data: { name } } })
    if (result.data?.updateUser) {
      setUser({ ...result.data.updateUser })
    }
  }

  return {
    user,
    saving,
    error,
    updateName,
  }
}
