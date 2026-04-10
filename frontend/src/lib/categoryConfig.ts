import type { LucideIcon } from 'lucide-react'
import {
  Tag as TagIcon,
  Briefcase,
  Utensils,
  Car,
  ShoppingCart,
  PiggyBank,
  Home,
  Heart,
  HeartPulse,
  Music,
  Zap,
  Wallet,
  PawPrint,
  Gift,
  Dumbbell,
  BookOpen,
  Plane,
  Mail,
  Wrench,
  Ticket,
} from 'lucide-react'

export { TagIcon }

export type ColorScheme = { bg: string; text: string }

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  green:  { bg: '#e0fae9', text: '#15803d' },
  blue:   { bg: '#dbeafe', text: '#1d4ed8' },
  purple: { bg: '#f3e8ff', text: '#7e22ce' },
  orange: { bg: '#ffedd5', text: '#c2410c' },
  pink:   { bg: '#fce7f3', text: '#be185d' },
  yellow: { bg: '#f7f3ca', text: '#a16207' },
  red:    { bg: '#fee2e2', text: '#dc2626' },
}

const PALETTE = Object.values(COLOR_SCHEMES)

export function getCategoryColors(color: string): ColorScheme {
  const lower = color.toLowerCase()
  for (const [key, scheme] of Object.entries(COLOR_SCHEMES)) {
    if (lower.includes(key)) return scheme
  }
  const hash = [...color].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return PALETTE[hash % PALETTE.length]
}

export const COLOR_PICKER = [
  { value: 'green',  hex: '#16a34a' },
  { value: 'blue',   hex: '#2563eb' },
  { value: 'purple', hex: '#9333ea' },
  { value: 'pink',   hex: '#db2777' },
  { value: 'red',    hex: '#dc2626' },
  { value: 'orange', hex: '#ea580c' },
  { value: 'yellow', hex: '#ca8a04' },
]

export const ICON_MAP: Record<string, LucideIcon> = {
  briefcase:            Briefcase,
  'briefcase-business': Briefcase,
  utensils:             Utensils,
  car:                  Car,
  'car-front':          Car,
  'shopping-cart':      ShoppingCart,
  'piggy-bank':         PiggyBank,
  home:                 Home,
  heart:                Heart,
  'heart-pulse':        HeartPulse,
  music:                Music,
  zap:                  Zap,
  wallet:               Wallet,
  'paw-print':          PawPrint,
  gift:                 Gift,
  dumbbell:             Dumbbell,
  'book-open':          BookOpen,
  plane:                Plane,
  mail:                 Mail,
  wrench:               Wrench,
  ticket:               Ticket,
}

export function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName?.toLowerCase()] ?? TagIcon
}

export const ICON_PICKER: Array<{ value: string; Icon: LucideIcon }> = [
  { value: 'briefcase-business', Icon: Briefcase },
  { value: 'car-front',          Icon: Car },
  { value: 'heart-pulse',        Icon: HeartPulse },
  { value: 'piggy-bank',         Icon: PiggyBank },
  { value: 'shopping-cart',      Icon: ShoppingCart },
  { value: 'ticket',             Icon: Ticket },
  { value: 'zap',                Icon: Zap },
  { value: 'utensils',           Icon: Utensils },
  { value: 'paw-print',          Icon: PawPrint },
  { value: 'home',               Icon: Home },
  { value: 'gift',               Icon: Gift },
  { value: 'dumbbell',           Icon: Dumbbell },
  { value: 'book-open',          Icon: BookOpen },
  { value: 'plane',              Icon: Plane },
  { value: 'mail',               Icon: Mail },
  { value: 'wrench',             Icon: Wrench },
]
