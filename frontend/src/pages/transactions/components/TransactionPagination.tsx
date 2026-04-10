import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TransactionPaginationProps {
  currentPage: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function TransactionPagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: TransactionPaginationProps) {
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, total)

  function pageNumbers(): number[] {
    const pages: number[] = []
    const start = Math.max(1, currentPage - 1)
    const end = Math.min(totalPages, start + 2)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="flex items-center justify-between px-6 py-5 border-t border-[#e5e7eb]">
      <span className="text-[14px] text-[#374151] leading-5">
        <span className="font-medium">{from}</span>
        {' a '}
        <span className="font-medium">{to}</span>
        {' | '}
        <span className="font-medium">{total}</span>
        {' resultados'}
      </span>

      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="bg-white border border-[#d1d5db] rounded-lg size-8 flex items-center justify-center text-[#374151] disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#f3f4f6] transition-colors outline-none cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </button>

        {pageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'rounded-lg size-8 flex items-center justify-center text-[14px] font-medium leading-5 outline-none transition-colors cursor-pointer',
              p === currentPage
                ? 'bg-[#1f6f43] text-white'
                : 'bg-white border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6]',
            )}
          >
            {p}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="bg-white border border-[#d1d5db] rounded-lg size-8 flex items-center justify-center text-[#374151] disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#f3f4f6] transition-colors outline-none cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
