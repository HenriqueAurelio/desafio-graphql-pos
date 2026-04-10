import { Search, ChevronDown, Calendar, ListFilter, type LucideIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { TagIcon } from '@/lib/categoryConfig'
import { PERIOD_OPTIONS } from '@/lib/period'
import type { Category } from '../useTransactions'

interface FilterSelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  icon: LucideIcon
}

function FilterSelect({ label, value, onChange, options, icon: Icon }: FilterSelectProps) {
  const selected = options.find((o) => o.value === value)
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <Label className="text-sm font-medium text-[#374151]">{label}</Label>
      <div className="relative">
        <div className="flex items-center gap-3 px-[13px] py-[15px] bg-white border border-[#d1d5db] rounded-lg pointer-events-none overflow-hidden">
          <Icon className="size-4 text-[#9ca3af] shrink-0" />
          <span className="flex-1 text-base text-[#111827] truncate">
            {selected?.label ?? '—'}
          </span>
          <ChevronDown className="size-4 text-[#9ca3af] shrink-0" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

interface TransactionFiltersProps {
  searchInput: string
  onSearchChange: (v: string) => void
  typeFilter: string
  onTypeChange: (v: string) => void
  categoryFilter: string
  onCategoryChange: (v: string) => void
  period: string
  onPeriodChange: (v: string) => void
  categories: Category[]
}

const TYPE_OPTIONS = [
  { value: 'ALL', label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]

export function TransactionFilters({
  searchInput,
  onSearchChange,
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  period,
  onPeriodChange,
  categories,
}: TransactionFiltersProps) {
  const categoryOptions = [
    { value: 'ALL', label: 'Todas' },
    ...categories.map((c) => ({ value: c.id, label: c.title })),
  ]

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl px-[25px] pt-[21px] pb-[25px] flex gap-4 items-end">
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <Label className="text-sm font-medium text-[#374151]">Buscar</Label>
        <div className="flex items-center gap-3 px-[13px] py-[15px] bg-white border border-[#d1d5db] rounded-lg">
          <Search className="size-4 text-[#9ca3af] shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por descrição"
            className="flex-1 text-base text-[#111827] placeholder:text-[#9ca3af] outline-none bg-transparent"
          />
        </div>
      </div>

      <FilterSelect
        label="Tipo"
        value={typeFilter}
        onChange={onTypeChange}
        options={TYPE_OPTIONS}
        icon={ListFilter}
      />
      <FilterSelect
        label="Categoria"
        value={categoryFilter}
        onChange={onCategoryChange}
        options={categoryOptions}
        icon={TagIcon}
      />
      <FilterSelect
        label="Período"
        value={period}
        onChange={onPeriodChange}
        options={PERIOD_OPTIONS}
        icon={Calendar}
      />
    </div>
  )
}
