import { createElement } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { getCategoryColors, getIcon } from '@/lib/categoryConfig'
import { CategoryTag } from './CategoryTag'
import type { Category } from '../useCategories'

interface CategoryCardProps {
  category: Category
  txCount: number
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
}

export function CategoryCard({ category, txCount, onEdit, onDelete }: CategoryCardProps) {
  const icon = getIcon(category.icon)
  const colors = getCategoryColors(category.color)

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div
          className="size-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: colors.bg }}
        >
          {createElement(icon, { className: 'size-4', style: { color: colors.text } })}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDelete(category.id)}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-[#fee2e2] text-[#9ca3af] hover:text-[#dc2626] transition-colors outline-none cursor-pointer"
          >
            <Trash2 className="size-4" />
          </button>
          <button
            onClick={() => onEdit(category)}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-[#f3f4f6] text-[#9ca3af] hover:text-[#374151] transition-colors outline-none cursor-pointer"
          >
            <Pencil className="size-4" />
          </button>
        </div>
      </div>

      <span className="text-[16px] font-semibold text-[#111827] leading-6">
        {category.title}
      </span>

      <span className="text-[14px] text-[#6b7280] leading-5 line-clamp-2 flex-1">
        {category.description}
      </span>

      <div className="flex items-center justify-between">
        <CategoryTag title={category.title} color={category.color} />
        <span className="text-[14px] text-[#6b7280] leading-5">
          {txCount} {txCount === 1 ? 'item' : 'itens'}
        </span>
      </div>
    </div>
  )
}
