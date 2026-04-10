import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/useAuth'
import { Logo } from './Logo'

const NAV_ITEMS: { to: string; label: string }[] = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transações' },
  { to: '/categories', label: 'Categorias' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function Navbar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const initials = user ? getInitials(user.name) : '?'

  return (
    <nav className="bg-white border-b border-[#e5e7eb] py-[17px] px-12 shrink-0">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        <Logo />

        <div className="flex gap-5 text-[14px] leading-5">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `outline-none transition-colors ${
                  isActive
                    ? 'font-semibold text-[#1f6f43]'
                    : 'font-normal text-[#4b5563] hover:text-[#111827]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={() => navigate('/profile')}
          title="Perfil"
          className="bg-[#d1d5db] rounded-full size-9 flex items-center justify-center text-[14px] font-medium text-[#111827] hover:bg-[#9ca3af] transition-colors outline-none cursor-pointer"
        >
          {initials}
        </button>
      </div>
    </nav>
  )
}
