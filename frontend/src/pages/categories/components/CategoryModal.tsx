import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ICON_PICKER, COLOR_PICKER } from '@/lib/categoryConfig'
import type { Category } from '../useCategories'

const categorySchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
  icon: z.string().min(1, 'Ícone obrigatório'),
  color: z.string().min(1, 'Cor obrigatória'),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryModalProps {
  editing: Category | null
  saving: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<void>
}

export function CategoryModal({ editing, saving, onClose, onSubmit }: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: editing
      ? {
          title: editing.title,
          description: editing.description ?? '',
          icon: editing.icon,
          color: editing.color,
        }
      : { title: '', description: '', icon: 'briefcase-business', color: 'green' },
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-[25px] w-[448px] max-h-[90vh] overflow-y-auto flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[16px] font-semibold text-[#111827] leading-6">
              {editing ? 'Editar categoria' : 'Nova categoria'}
            </span>
            <span className="text-[14px] text-[#6b7280] leading-5">
              Organize suas transações com categorias
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 shrink-0 flex items-center justify-center rounded-lg border border-[#d1d5db] text-[#6b7280] hover:bg-[#f3f4f6] outline-none cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-title" className="text-[14px] font-medium text-[#374151]">
              Título
            </Label>
            <Input
              id="cat-title"
              placeholder="Ex. Alimentação"
              {...register('title')}
              className="h-[50px] rounded-lg border-[#d1d5db] text-[16px] text-[#111827]"
            />
            {errors.title && (
              <span className="text-[12px] text-[#dc2626]">{errors.title.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-desc" className="text-[14px] font-medium text-[#374151]">
              Descrição
            </Label>
            <Input
              id="cat-desc"
              placeholder="Descrição da categoria"
              {...register('description')}
              className="h-[50px] rounded-lg border-[#d1d5db] text-[16px] text-[#111827]"
            />
            <span className="text-[12px] text-[#6b7280]">Opcional</span>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-[14px] font-medium text-[#374151]">Ícone</Label>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {ICON_PICKER.map(({ value, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`size-[42px] flex items-center justify-center rounded-lg border transition-colors outline-none ${
                        field.value === value
                          ? 'bg-[#f8f9fa] border-[#1f6f43] text-[#1f6f43]'
                          : 'border-[#d1d5db] text-[#6b7280] hover:bg-[#f8f9fa]'
                      }`}
                    >
                      <Icon className="size-5" />
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.icon && (
              <span className="text-[12px] text-[#dc2626]">{errors.icon.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-[14px] font-medium text-[#374151]">Cor</Label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {COLOR_PICKER.map(({ value, hex }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex-1 p-[5px] rounded-lg border transition-colors outline-none ${
                        field.value === value
                          ? 'bg-[#f8f9fa] border-[#1f6f43]'
                          : 'border-[#d1d5db] hover:bg-[#f8f9fa]'
                      }`}
                    >
                      <div className="h-5 rounded-[4px]" style={{ backgroundColor: hex }} />
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.color && (
              <span className="text-[12px] text-[#dc2626]">{errors.color.message}</span>
            )}
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full h-12 rounded-lg bg-[#1f6f43] hover:bg-[#166534] text-white text-[16px] font-medium mt-2"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
