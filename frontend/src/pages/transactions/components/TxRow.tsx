import { createElement } from 'react'
import { CircleArrowUp, CircleArrowDown, Trash2, SquarePen } from 'lucide-react'
import { getCategoryColors, getIcon, TagIcon } from '@/lib/categoryConfig'
import { formatCurrency, formatDate } from '@/lib/format'
import { CategoryTag } from '@/pages/categories/components/CategoryTag'
import type { Transaction, Category } from '../useTransactions'

interface TxRowProps {
  transaction: Transaction
  category: Category | undefined
  isLast: boolean
  onEdit: () => void
  onDelete: () => void
}

export function TxRow({ transaction, category, isLast, onEdit, onDelete }: TxRowProps) {
  const isIncome = transaction.type === 'INCOME'
  const icon = category ? getIcon(category.icon) : TagIcon
  const colors = category ? getCategoryColors(category.color) : { bg: '#f3f4f6', text: '#6b7280' }

  return (
    <div className={`flex items-center w-full ${!isLast ? 'border-b border-[#e5e7eb]' : ''}`}>
      <div className="flex flex-1 items-center gap-4 h-[72px] px-6 min-w-0">
        <div
          className="shrink-0 size-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.bg }}
        >
          {createElement(icon, { className: 'size-4', style: { color: colors.text } })}
        </div>
        <span className="text-[16px] font-medium text-[#111827] leading-6 truncate">
          {transaction.name}
        </span>
      </div>

      <div className="flex items-center justify-center h-[72px] px-6 w-[112px] shrink-0">
        <span className="text-[14px] text-[#4b5563] leading-5 whitespace-nowrap">
          {formatDate(transaction.date)}
        </span>
      </div>

      <div className="flex items-center justify-center h-[72px] px-6 w-[200px] shrink-0">
        {category ? (
          <CategoryTag title={category.title} color={category.color} />
        ) : (
          <span className="text-xs text-[#9ca3af]">—</span>
        )}
      </div>

      <div className="flex items-center justify-center h-[72px] px-6 w-[136px] shrink-0">
        <div className="flex items-center gap-2">
          {isIncome ? (
            <>
              <CircleArrowUp className="size-4 shrink-0 text-[#16a34a]" />
              <span className="text-[14px] font-medium text-[#15803d] leading-5 whitespace-nowrap">
                Entrada
              </span>
            </>
          ) : (
            <>
              <CircleArrowDown className="size-4 shrink-0 text-[#dc2626]" />
              <span className="text-[14px] font-medium text-[#b91c1c] leading-5 whitespace-nowrap">
                Saída
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end h-[72px] px-6 w-[200px] shrink-0">
        <span className="text-[14px] font-semibold text-[#111827] leading-5 whitespace-nowrap">
          {isIncome ? '+ ' : '- '}
          {formatCurrency(transaction.amount)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-2 h-[72px] px-6 w-[120px] shrink-0">
        <button
          onClick={onDelete}
          className="bg-white border border-[#d1d5db] rounded-lg size-8 flex items-center justify-center text-[#6b7280] hover:text-destructive hover:border-destructive/50 transition-colors outline-none cursor-pointer"
          title="Excluir"
        >
          <Trash2 className="size-4" />
        </button>
        <button
          onClick={onEdit}
          className="bg-white border border-[#d1d5db] rounded-lg size-8 flex items-center justify-center text-[#6b7280] hover:text-[#1f6f43] hover:border-[#1f6f43]/50 transition-colors outline-none cursor-pointer"
          title="Editar"
        >
          <SquarePen className="size-4" />
        </button>
      </div>
    </div>
  )
}
