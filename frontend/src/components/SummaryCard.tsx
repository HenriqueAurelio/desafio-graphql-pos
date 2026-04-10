import type { LucideIcon } from 'lucide-react'

interface SummaryCardProps {
  icon: LucideIcon
  iconColor: string
  label: string
  value: string
  variant?: 'vertical' | 'horizontal'
}

export function SummaryCard({ icon: Icon, iconColor, label, value, variant = 'vertical' }: SummaryCardProps) {
  if (variant === 'horizontal') {
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-[25px] flex flex-row gap-4 items-start">
        <div className="size-8 shrink-0 flex items-center justify-center">
          <Icon className="size-6" style={{ color: iconColor }} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[28px] font-bold text-[#111827] leading-8">{value}</p>
          <span className="text-[12px] font-medium text-[#6b7280] uppercase tracking-[0.6px] leading-4">
            {label}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-[25px] flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Icon className="size-5 shrink-0" style={{ color: iconColor }} />
        <span className="text-[12px] font-medium text-[#6b7280] uppercase tracking-[0.6px] leading-4">
          {label}
        </span>
      </div>
      <p className="text-[28px] font-bold text-[#111827] leading-8">{value}</p>
    </div>
  )
}
