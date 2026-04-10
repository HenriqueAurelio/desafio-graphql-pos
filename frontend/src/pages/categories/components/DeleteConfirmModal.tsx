import { X } from 'lucide-react'
import type { Category } from '../useCategories'

interface DeleteConfirmModalProps {
  category: Category
  txCount: number
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmModal({
  category,
  txCount,
  deleting,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-[25px] w-[448px] flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[16px] font-semibold text-[#111827] leading-6">
              Excluir categoria
            </span>
            <span className="text-[14px] text-[#6b7280] leading-5">
              Esta ação não poderá ser desfeita
            </span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="size-8 shrink-0 flex items-center justify-center rounded-lg border border-[#d1d5db] text-[#6b7280] hover:bg-[#f3f4f6] outline-none cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[14px] text-[#374151] leading-5">
            Tem certeza que deseja excluir a categoria{' '}
            <span className="font-semibold text-[#111827]">"{category.title}"</span>?
          </p>
          {txCount > 0 && (
            <div className="flex items-start gap-3 bg-[#fff7ed] border border-[#fed7aa] rounded-lg p-3">
              <span className="text-[#c2410c] text-[18px] leading-none mt-0.5">⚠</span>
              <p className="text-[13px] text-[#c2410c] leading-5">
                Esta categoria possui{' '}
                <span className="font-semibold">
                  {txCount} {txCount === 1 ? 'transação vinculada' : 'transações vinculadas'}
                </span>.
                {' '}Todas serão excluídas permanentemente junto com a categoria.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[#d1d5db] text-[14px] font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors outline-none cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 h-10 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[14px] font-medium transition-colors outline-none cursor-pointer disabled:opacity-50"
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}
