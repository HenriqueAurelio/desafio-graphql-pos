import { getCategoryColors } from '@/lib/categoryConfig'

interface CategoryTagProps {
  title: string
  color: string
  className?: string
}

export function CategoryTag({ title, color, className }: CategoryTagProps) {
  const { bg, text } = getCategoryColors(color)
  return (
    <span
      className={`px-3 py-1 rounded-full text-[14px] font-medium leading-5 whitespace-nowrap ${className ?? ''}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {title}
    </span>
  )
}
