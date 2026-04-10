import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, UserRoundPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Logo } from '@/components/Logo'
import { loginSchema, type LoginFormData, useLogin } from './useLogin'
import { getErrorMessage } from '@/lib/apolloErrors'

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error } = useLogin()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = handleSubmit(async (data) => {
    const result = await login(data)
    if (result.data) navigate('/')
  })

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col items-center pt-12 px-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-[448px]">
        <Logo />

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 w-full flex flex-col gap-8">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-xl font-bold text-[#111827] leading-7 m-0">Fazer login</h2>
            <p className="text-base text-[#4b5563] leading-6">Entre na sua conta para continuar</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#374151]">E-mail</Label>
                <div
                  className={cn(
                    'flex items-center gap-3 px-[13px] py-[15px] bg-white border rounded-lg',
                    errors.email ? 'border-destructive ring-3 ring-destructive/20' : 'border-[#d1d5db]'
                  )}
                >
                  <Mail className="size-4 text-[#9ca3af] shrink-0" />
                  <Input
                    type="email"
                    placeholder="mail@exemplo.com"
                    className="flex-1 h-auto border-0 p-0 text-base text-[#111827] placeholder:text-[#9ca3af] focus-visible:ring-0 focus-visible:border-0 shadow-none"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#374151]">Senha</Label>
                <div
                  className={cn(
                    'flex items-center gap-3 px-[13px] py-[15px] bg-white border rounded-lg',
                    errors.password ? 'border-destructive ring-3 ring-destructive/20' : 'border-[#d1d5db]'
                  )}
                >
                  <Lock className="size-4 text-[#9ca3af] shrink-0" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    className="flex-1 h-auto border-0 p-0 text-base text-[#111827] placeholder:text-[#9ca3af] focus-visible:ring-0 focus-visible:border-0 shadow-none"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="shrink-0 text-[#9ca3af] hover:text-[#6b7280] outline-none cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <Eye className="size-4" />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 cursor-pointer font-normal text-sm text-[#374151]">
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        name={field.name}
                      />
                    )}
                  />
                  Lembrar-me
                </Label>
                <a
                  href="#"
                  className="text-sm font-medium text-[#1f6f43] leading-5 hover:underline outline-none"
                >
                  Recuperar senha
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-[#1f6f43] hover:bg-[#1a5e39] text-white text-base font-medium gap-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            {error && (
              <p className="text-destructive text-sm text-center">{getErrorMessage(error)}</p>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#d1d5db]" />
              <span className="text-sm text-[#6b7280]">ou</span>
              <div className="flex-1 h-px bg-[#d1d5db]" />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#4b5563] text-center leading-5">
                Ainda não tem uma conta?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/register')}
                className="h-12 w-full border-[#d1d5db] text-[#374151] text-base font-medium gap-2"
              >
                <UserRoundPlus className="size-[18px]" />
                Criar conta
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
