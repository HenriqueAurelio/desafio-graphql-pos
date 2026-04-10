export interface PeriodOption {
  value: string
  label: string
}

export function buildPeriodOptions(): PeriodOption[] {
  const options: PeriodOption[] = [{ value: 'ALL', label: 'Todos os períodos' }]
  const now = new Date()
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthName = d.toLocaleString('pt-BR', { month: 'long' })
    const label = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} / ${d.getFullYear()}`
    options.push({ value, label })
  }
  return options
}

export const PERIOD_OPTIONS = buildPeriodOptions()

export function currentPeriodValue(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
