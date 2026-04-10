import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown, CircleArrowUp, CircleArrowDown, X, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TagIcon } from '@/lib/categoryConfig'
import type { Transaction, Category, TransactionInput } from '../useTransactions'

const txSchema = z.object({
  name: z.string().min(1, 'Informe a descrição'),
  amount: z
    .number({ invalid_type_error: 'Valor inválido' })
    .positive('Informe um valor positivo'),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().min(1, 'Informe a data'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
})

type TxFormData = z.infer<typeof txSchema>

interface TransactionModalProps {
  transaction?: Transaction
  categories: Category[]
  saving: boolean
  onClose: () => void
  onSave: (data: TransactionInput) => Promise<void>
}

export function TransactionModal({
  transaction,
  categories,
  saving,
  onClose,
  onSave,
}: TransactionModalProps) {
  const isEditing = !!transaction

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TxFormData>({
    resolver: zodResolver(txSchema),
    defaultValues: {
      name: transaction?.name ?? '',
      amount: transaction?.amount ?? ('' as unknown as number),
      type: transaction?.type ?? 'EXPENSE',
      date: transaction ? new Date(transaction.date).toISOString().split('T')[0] : '',
      categoryId: transaction?.categoryId ?? '',
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    await onSave({
      ...data,
      date: new Date(data.date).toISOString(),
    })
    onClose()
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl w-[448px] flex flex-col gap-6 p-[25px] border border-[#e5e7eb]">
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <h2 className="text-[16px] font-semibold text-[#111827] leading-6">
              {isEditing ? 'Editar transação' : 'Nova transação'}
            </h2>
            <p className="text-[14px] text-[#4b5563] leading-5 truncate">
              Registre sua despesa ou receita
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center size-8 rounded-lg border border-[#d1d5db] bg-white text-[#6b7280] hover:bg-[#f3f4f6] outline-none shrink-0 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="border border-[#e5e7eb] rounded-xl p-2">
              <div className="flex">
                <button
                  type="button"
                  onClick={() => field.onChange('EXPENSE')}
                  className={`flex flex-1 items-center justify-center gap-3 px-3 py-[14px] rounded-lg text-[16px] outline-none transition-all ${
                    field.value === 'EXPENSE'
                      ? 'bg-[#f8f9fa] border border-[#dc2626] font-medium text-[#111827]'
                      : 'font-normal text-[#4b5563] hover:bg-[#f9fafb]'
                  }`}
                >
                  <CircleArrowDown
                    className={`size-4 shrink-0 ${field.value === 'EXPENSE' ? 'text-[#dc2626]' : 'text-[#9ca3af]'}`}
                  />
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('INCOME')}
                  className={`flex flex-1 items-center justify-center gap-3 px-3 py-[14px] rounded-lg text-[16px] outline-none transition-all ${
                    field.value === 'INCOME'
                      ? 'bg-[#f8f9fa] border border-[#16a34a] font-medium text-[#111827]'
                      : 'font-normal text-[#4b5563] hover:bg-[#f9fafb]'
                  }`}
                >
                  <CircleArrowUp
                    className={`size-4 shrink-0 ${field.value === 'INCOME' ? 'text-[#16a34a]' : 'text-[#9ca3af]'}`}
                  />
                  Receita
                </button>
              </div>
            </div>
          )}
        />

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <Label className="text-[14px] font-medium text-[#374151]">Descrição</Label>
            <Input
              type="text"
              placeholder="Ex. Almoço no restaurante"
              className={cn(
                'h-auto px-[13px] py-[15px] text-base border rounded-lg',
                errors.name ? 'border-[#dc2626]' : 'border-[#d1d5db]',
              )}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-[#dc2626] text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label className="text-[14px] font-medium text-[#374151]">Data</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 size-4 text-[#9ca3af]" />
                <Input
                  type="date"
                  className={cn(
                    'h-auto pl-[38px] pr-[13px] py-[15px] text-base border rounded-lg',
                    errors.date ? 'border-[#dc2626]' : 'border-[#d1d5db]',
                  )}
                  {...register('date')}
                />
              </div>
              {errors.date && (
                <p className="text-[#dc2626] text-xs">{errors.date.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label className="text-[14px] font-medium text-[#374151]">Valor</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#9ca3af]">
                  R$
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  className={cn(
                    'h-auto pl-[38px] pr-[13px] py-[15px] text-base border rounded-lg',
                    errors.amount ? 'border-[#dc2626]' : 'border-[#d1d5db]',
                  )}
                  {...register('amount', { valueAsNumber: true })}
                />
              </div>
              {errors.amount && (
                <p className="text-[#dc2626] text-xs">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-[14px] font-medium text-[#374151]">Categoria</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => {
                const selected = categories.find((c) => c.id === field.value)
                return (
                  <div className="relative">
                    <div
                      className={cn(
                        'flex items-center gap-3 px-[13px] py-[15px] bg-white border rounded-lg pointer-events-none',
                        errors.categoryId ? 'border-[#dc2626]' : 'border-[#d1d5db]',
                      )}
                    >
                      <TagIcon className="size-4 text-[#9ca3af] shrink-0" />
                      <span className={`flex-1 text-base truncate ${selected ? 'text-[#111827]' : 'text-[#9ca3af]'}`}>
                        {selected ? selected.title : 'Selecione'}
                      </span>
                      <ChevronDown className="size-4 text-[#9ca3af] shrink-0" />
                    </div>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      <option value="">Selecione</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              }}
            />
            {errors.categoryId && (
              <p className="text-[#dc2626] text-xs">{errors.categoryId.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full h-12 bg-[#1f6f43] hover:bg-[#166534] text-white text-base font-medium rounded-lg"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
