"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Heart, Mail, Lock, ArrowLeft, UserCircle2, UserCog, Stethoscope } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { ApiError } from '@/lib/api/client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      toast.success('¡Bienvenido a Smart Salud!', {
        description: 'Has iniciado sesión correctamente',
      })
      router.push('/dashboard')
    } catch (error) {
      const msg = error instanceof ApiError
        ? error.message
        : 'Verifica tus credenciales e intenta nuevamente'
      toast.error('Error al iniciar sesión', { description: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const fillCredentials = (role: 'admin' | 'doctor' | 'patient') => {
    let email = ''
    if (role === 'admin') email = 'admin@smartsalud.com'
    if (role === 'doctor') email = 'doctor@smartsalud.com'
    if (role === 'patient') email = 'paciente@smartsalud.com'

    setFormData({
      ...formData,
      email: email,
      password: 'password123'
    })
    
    toast.info(`Credenciales de ${role} cargadas`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Inicio
        </Button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Smart Salud
          </h1>
          <p className="text-muted-foreground mt-2">Portal de Autenticación</p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a tu portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            {/* Quick Login Section for Development */}
            <div className="mb-6 p-4 bg-slate-50 border rounded-lg">
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-3 text-center tracking-wider">
                Acceso Rápido (Demo)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col h-auto py-2 gap-1 bg-white hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                  onClick={() => fillCredentials('patient')}
                  type="button"
                >
                  <UserCircle2 className="w-4 h-4" />
                  <span className="text-[10px]">Paciente</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col h-auto py-2 gap-1 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  onClick={() => fillCredentials('doctor')}
                  type="button"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span className="text-[10px]">Médico</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col h-auto py-2 gap-1 bg-white hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                  onClick={() => fillCredentials('admin')}
                  type="button"
                >
                  <UserCog className="w-4 h-4" />
                  <span className="text-[10px]">Admin</span>
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <button
                    type="button"
                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, remember: checked as boolean })
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Recordar mi sesión
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 mt-2"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    ¿No tienes una cuenta?
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-2"
                size="lg"
                onClick={() => router.push('/registro')}
              >
                Crear Cuenta Nueva
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Al iniciar sesión, aceptas nuestros{' '}
          <Link href="#" className="text-emerald-600 hover:underline">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="#" className="text-emerald-600 hover:underline">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  )
}
