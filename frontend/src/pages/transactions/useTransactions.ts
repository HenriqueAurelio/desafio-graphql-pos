import { useQuery, useMutation } from '@apollo/client/react'
import { LIST_TRANSACTIONS, LIST_TRANSACTIONS_PAGINATED } from '@/graphql/queries/transactions'
import { LIST_CATEGORIES } from '@/graphql/queries/categories'
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from '@/graphql/mutations/transactions'
import type { Transaction, Category } from '../dashboard/useDashboard'

export type { Transaction, Category }

export interface TransactionInput {
  name: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  categoryId: string
}

export interface TransactionFilters {
  search: string
  type: string
  categoryId: string
  period: string
  page: number
  pageSize: number
}

interface PaginatedTransactionsData {
  listTransactionsPaginated: {
    data: Transaction[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export function useTransactions(filters: TransactionFilters) {
  const { search, type, categoryId, period, page, pageSize } = filters
  const [year, month] = period !== 'ALL'
    ? period.split('-').map(Number)
    : [undefined, undefined]

  const filterInput = {
    ...(search ? { search } : {}),
    ...(type !== 'ALL' ? { type } : {}),
    ...(categoryId !== 'ALL' ? { categoryId } : {}),
    ...(month && year ? { month, year } : {}),
  }

  const paginationInput = { page, pageSize }
  const queryVars = { filter: filterInput, pagination: paginationInput }

  const { data: txData, loading: txLoading } = useQuery<PaginatedTransactionsData>(LIST_TRANSACTIONS_PAGINATED, {
    variables: queryVars,
  })

  const { data: catData, loading: catLoading } = useQuery<{
    listCategory: Category[]
  }>(LIST_CATEGORIES)

  const [createMutation, { loading: creating }] = useMutation(CREATE_TRANSACTION)
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_TRANSACTION)
  const [deleteMutation, { loading: deleting }] = useMutation(DELETE_TRANSACTION)

  const paginatedResult = txData?.listTransactionsPaginated
  const transactions: Transaction[] = paginatedResult?.data ?? []
  const total: number = paginatedResult?.total ?? 0
  const totalPages: number = paginatedResult?.totalPages ?? 1

  const categories: Category[] = catData?.listCategory ?? []
  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]))

  const refetchList = [
    { query: LIST_TRANSACTIONS_PAGINATED, variables: queryVars },
    { query: LIST_TRANSACTIONS },
  ]

  async function createTransaction(data: TransactionInput) {
    await createMutation({ variables: { data }, refetchQueries: refetchList })
  }

  async function updateTransaction(id: string, data: TransactionInput) {
    await updateMutation({ variables: { id, data }, refetchQueries: refetchList })
  }

  async function deleteTransaction(id: string) {
    await deleteMutation({ variables: { id }, refetchQueries: refetchList })
  }

  return {
    transactions,
    total,
    totalPages,
    categories,
    categoryMap,
    loading: txLoading || catLoading,
    creating,
    updating,
    deleting,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
