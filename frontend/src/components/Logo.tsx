export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[11px] ${className ?? ''}`}>
      <img src="/logo-icon.svg" alt="" className="size-8 shrink-0" />
      <img src="/logo-text.svg" alt="Financy" className="h-[18.5px] w-[89.9px] shrink-0" />
    </div>
  )
}
