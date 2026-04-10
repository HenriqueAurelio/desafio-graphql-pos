import { useQuery } from '@apollo/client/react'
import { LIST_TRANSACTIONS } from '@/graphql/queries/transactions'
import { LIST_CATEGORIES } from '@/graphql/queries/categories'
import { useAuth } from '@/contexts/useAuth'

export interface Transaction {
  id: string
  name: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  categoryId: string
}

export interface Category {
  id: string
  title: string
  description: string
  color: string
  icon: string
}

export interface CategoryWithStats extends Category {
  count: number
  total: number
}

interface TransactionsData {
  listTransactions: Transaction[]
}

interface CategoriesData {
  listCategory: Category[]
}

export function useDashboard() {
  const { user } = useAuth()

  const { data: txData, loading: txLoading } = useQuery<TransactionsData>(LIST_TRANSACTIONS)
  const { data: catData, loading: catLoading } = useQuery<CategoriesData>(LIST_CATEGORIES)

  const transactions = txData?.listTransactions ?? []
  const categories = catData?.listCategory ?? []

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const thisMonthTransactions = transactions.filter((tx) => {
    const d = new Date(tx.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const totalBalance = transactions.reduce(
    (sum, tx) => (tx.type === 'INCOME' ? sum + tx.amount : sum - tx.amount),
    0,
  )

  const monthlyIncome = thisMonthTransactions
    .filter((tx) => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const monthlyExpenses = thisMonthTransactions
    .filter((tx) => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const categoriesWithStats: CategoryWithStats[] = categories
    .map((cat) => {
      const catTxs = transactions.filter((tx) => tx.categoryId === cat.id)
      const total = catTxs.reduce((sum, tx) => sum + tx.amount, 0)
      return { ...cat, count: catTxs.length, total }
    })
    .filter((c) => c.count > 0)

  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]))

  return {
    user,
    loading: txLoading || catLoading,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    recentTransactions,
    categoriesWithStats,
    categoryMap,
  }
}
