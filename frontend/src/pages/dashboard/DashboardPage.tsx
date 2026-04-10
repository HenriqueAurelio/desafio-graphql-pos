import { createElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, CircleArrowUp, CircleArrowDown, ChevronRight, Plus } from 'lucide-react'
import { SummaryCard } from '@/components/SummaryCard'
import { getCategoryColors, getIcon, TagIcon } from '@/lib/categoryConfig'
import { formatCurrency, formatDate } from '@/lib/format'
import { useDashboard, type Category, type Transaction } from './useDashboard'
import { CategoryTag } from '@/pages/categories/components/CategoryTag'

interface TransactionRowProps {
  transaction: Transaction
  category: Category | undefined
  isLast: boolean
}

function TransactionRow({ transaction, category, isLast }: TransactionRowProps) {
  const isIncome = transaction.type === 'INCOME'
  const icon = category ? getIcon(category.icon) : TagIcon
  const colors = category ? getCategoryColors(category.color) : { bg: '#f3f4f6', text: '#6b7280' }

  return (
    <div className={`flex items-center w-full ${!isLast ? 'border-b border-[#e5e7eb]' : ''}`}>
      <div className="flex flex-1 items-center gap-4 h-20 px-6">
        <div
          className="shrink-0 size-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.bg }}
        >
          {createElement(icon, { className: 'size-4', style: { color: colors.text } })}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[16px] font-medium text-[#111827] leading-6 truncate">
            {transaction.name}
          </span>
          <span className="text-[14px] text-[#4b5563] leading-5">
            {formatDate(transaction.date)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center h-20 px-6 w-40 shrink-0">
        {category ? (
          <CategoryTag title={category.title} color={category.color} />
        ) : (
          <span className="text-xs text-[#9ca3af]">—</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 h-20 px-6 w-40 shrink-0">
        <span className="text-[14px] font-semibold text-[#111827] leading-5 whitespace-nowrap">
          {isIncome ? '+ ' : '- '}
          {formatCurrency(transaction.amount)}
        </span>
        {isIncome ? (
          <CircleArrowUp className="size-4 shrink-0 text-[#16a34a]" />
        ) : (
          <CircleArrowDown className="size-4 shrink-0 text-[#dc2626]" />
        )}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const {
    loading,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    recentTransactions,
    categoriesWithStats,
    categoryMap,
  } = useDashboard()

  return (
    <main className="p-12 grid grid-cols-3 gap-6">
        <SummaryCard
          icon={Wallet}
          iconColor="#7e22ce"
          label="Saldo total"
          value={loading ? '...' : formatCurrency(totalBalance)}
        />
        <SummaryCard
          icon={CircleArrowUp}
          iconColor="#16a34a"
          label="Receitas do mês"
          value={loading ? '...' : formatCurrency(monthlyIncome)}
        />
        <SummaryCard
          icon={CircleArrowDown}
          iconColor="#dc2626"
          label="Despesas do mês"
          value={loading ? '...' : formatCurrency(monthlyExpenses)}
        />

        <div className="col-span-2 bg-white border border-[#e5e7eb] rounded-xl overflow-hidden self-start">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e7eb]">
            <span className="text-[12px] font-medium text-[#6b7280] uppercase tracking-[0.6px] leading-4">
              Transações recentes
            </span>
            <button
              onClick={() => navigate('/transactions')}
              className="flex items-center gap-1 text-[14px] font-medium text-[#1f6f43] leading-5 hover:underline outline-none cursor-pointer"
            >
              Ver todas
              <ChevronRight className="size-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-20 text-[#9ca3af] text-sm">
              Carregando...
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-[#9ca3af] text-sm">
              Nenhuma transação ainda
            </div>
          ) : (
            recentTransactions.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                category={categoryMap.get(tx.categoryId)}
                isLast={i === recentTransactions.length - 1}
              />
            ))
          )}

          <div className="flex items-center justify-center px-6 py-5 border-t border-[#e5e7eb]">
            <button
              onClick={() => navigate('/transactions')}
              className="flex items-center gap-1 text-[14px] font-medium text-[#1f6f43] leading-5 hover:underline outline-none cursor-pointer"
            >
              <Plus className="size-5" />
              Nova transação
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden self-start">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e7eb]">
            <span className="text-[12px] font-medium text-[#6b7280] uppercase tracking-[0.6px] leading-4">
              Categorias
            </span>
            <button onClick={() => navigate('/categories')} className="flex items-center gap-1 text-[14px] font-medium text-[#1f6f43] leading-5 hover:underline outline-none cursor-pointer">
              Gerenciar
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="flex flex-col gap-5 p-6">
            {loading ? (
              <span className="text-sm text-[#9ca3af]">Carregando...</span>
            ) : categoriesWithStats.length === 0 ? (
              <span className="text-sm text-[#9ca3af]">Nenhuma categoria com transações</span>
            ) : (
              categoriesWithStats.map((cat) => (
                <div key={cat.id} className="flex items-center gap-1">
                  <CategoryTag title={cat.title} color={cat.color} />
                  <span className="flex-1 text-[14px] text-[#4b5563] text-right leading-5">
                    {cat.count} {cat.count === 1 ? 'item' : 'itens'}
                  </span>
                  <span className="text-[14px] font-semibold text-[#111827] text-right leading-5 w-22 shrink-0">
                    {formatCurrency(cat.total)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
    </main>
  )
}
