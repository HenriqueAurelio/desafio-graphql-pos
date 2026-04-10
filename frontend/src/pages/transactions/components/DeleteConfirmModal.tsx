import { X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteConfirmModalProps {
  transactionName: string
  deleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmModal({
  transactionName,
  deleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl w-[400px] flex flex-col gap-6 p-[25px] border border-[#e5e7eb]">
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <h2 className="text-[16px] font-semibold text-[#111827] leading-6">Excluir transação</h2>
            <p className="text-[14px] text-[#4b5563] leading-5">Esta ação não poderá ser desfeita</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center size-8 rounded-lg border border-[#d1d5db] bg-white text-[#6b7280] hover:bg-[#f3f4f6] outline-none shrink-0 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 bg-[#fef2f2] border border-[#fecaca] rounded-lg p-4">
          <div className="flex items-center justify-center size-10 rounded-lg bg-[#fee2e2] shrink-0">
            <AlertTriangle className="size-5 text-[#dc2626]" />
          </div>
          <p className="text-[14px] text-[#374151] leading-5">
            Tem certeza que deseja excluir{' '}
            <span className="font-semibold text-[#111827]">"{transactionName}"</span>?
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 border-[#d1d5db] text-[#374151] text-[14px] font-medium rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="flex-1 h-10 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[14px] font-medium rounded-lg"
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </div>
  )
}
