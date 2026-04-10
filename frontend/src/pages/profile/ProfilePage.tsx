import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@apollo/client/react'
import { UserRound, Mail, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/useAuth'
import { LOGOUT_MUTATION } from '@/graphql/mutations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProfile } from './useProfile'

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfilePage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const { user, saving, updateName } = useProfile()
  const [logoutMutation] = useMutation(LOGOUT_MUTATION)

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? '' },
  })

  async function onSubmit(data: ProfileFormData) {
    await updateName(data.name)
  }

  async function handleLogout() {
    await logoutMutation().catch(() => {})
    setUser(null)
    navigate('/')
  }

  const initials = user ? getInitials(user.name) : '?'

  return (
    <main className="flex flex-col items-center p-12">
        <div className="bg-white border border-[#e5e7eb] rounded-xl flex flex-col gap-8 p-[33px] w-[448px]">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-[#d1d5db] rounded-full size-16 flex items-center justify-center text-[24px] font-medium text-[#111827] leading-10">
              {initials}
            </div>
            <div className="flex flex-col items-center gap-0.5 w-full text-center">
              <span className="text-[20px] font-semibold text-[#111827] leading-7">
                {user?.name ?? '—'}
              </span>
              <span className="text-[16px] text-[#6b7280] leading-6">
                {user?.email ?? '—'}
              </span>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb]" />

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-name" className="text-[14px] font-medium text-[#374151]">
                Nome completo
              </Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280]" />
                <Input
                  id="profile-name"
                  {...register('name')}
                  className="pl-9 h-[50px] rounded-lg border-[#d1d5db] text-[16px] text-[#111827]"
                />
              </div>
              {errors.name && (
                <span className="text-[12px] text-[#dc2626]">{errors.name.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-email" className="text-[14px] font-medium text-[#374151]">
                E-mail
              </Label>
              <div className="relative opacity-50">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280]" />
                <Input
                  id="profile-email"
                  value={user?.email ?? ''}
                  readOnly
                  tabIndex={-1}
                  className="pl-9 h-[50px] rounded-lg border-[#d1d5db] text-[16px] cursor-not-allowed bg-white"
                />
              </div>
              <span className="text-[12px] text-[#6b7280]">O e-mail não pode ser alterado</span>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="w-full h-12 rounded-lg bg-[#1f6f43] hover:bg-[#166534] text-white text-[16px] font-medium flex items-center justify-center"
              >
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="w-full h-12 rounded-lg border-[#d1d5db] text-[#374151] text-[16px] font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <LogOut className="size-[18px] text-[#ef4444]" />
                Sair da conta
              </Button>
            </div>
          </form>
        </div>
    </main>
  )
}
