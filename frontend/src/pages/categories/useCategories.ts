import { useQuery, useMutation } from '@apollo/client/react'
import { LIST_CATEGORIES } from '@/graphql/queries/categories'
import { LIST_TRANSACTIONS } from '@/graphql/queries/transactions'
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from '@/graphql/mutations/categories'
import type { Category, Transaction } from '../dashboard/useDashboard'

export type { Category, Transaction }

export interface CategoryInput {
  title: string
  description?: string
  icon: string
  color: string
}

const REFETCH = { refetchQueries: [{ query: LIST_CATEGORIES }] }
const REFETCH_DELETE = { refetchQueries: [{ query: LIST_CATEGORIES }, { query: LIST_TRANSACTIONS }] }

export function useCategories() {
  const { data: catData, loading: catLoading } = useQuery<{
    listCategory: Category[]
  }>(LIST_CATEGORIES)

  const { data: txData, loading: txLoading } = useQuery<{
    listTransactions: Transaction[]
  }>(LIST_TRANSACTIONS)

  const [createMutation, { loading: creating }] = useMutation(CREATE_CATEGORY, REFETCH)
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_CATEGORY, REFETCH)
  const [deleteMutation, { loading: deleting }] = useMutation(DELETE_CATEGORY, REFETCH_DELETE)

  const categories = catData?.listCategory ?? []
  const transactions = txData?.listTransactions ?? []

  const txCountMap = new Map<string, number>()
  for (const tx of transactions) {
    if (tx.categoryId) {
      txCountMap.set(tx.categoryId, (txCountMap.get(tx.categoryId) ?? 0) + 1)
    }
  }

  const topCategory = categories.length
    ? categories.reduce((best, cat) =>
        (txCountMap.get(cat.id) ?? 0) >= (txCountMap.get(best.id) ?? 0) ? cat : best,
      )
    : null

  function getCategoryTxCount(id: string) {
    return txCountMap.get(id) ?? 0
  }

  async function createCategory(data: CategoryInput) {
    await createMutation({ variables: { data } })
  }

  async function updateCategory(id: string, data: CategoryInput) {
    await updateMutation({ variables: { id, data } })
  }

  async function deleteCategory(id: string) {
    await deleteMutation({ variables: { id } })
  }

  return {
    categories,
    totalTransactions: transactions.length,
    topCategory,
    getCategoryTxCount,
    loading: catLoading || txLoading,
    creating,
    updating,
    deleting,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
