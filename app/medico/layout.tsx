"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, Calendar, Users, Stethoscope, Loader2 } from 'lucide-react'

const navLinks = [
  { href: '/medico/citas',     label: 'Citas del Día',  icon: ClipboardList },
  { href: '/medico/agenda',    label: 'Agenda',          icon: Calendar      },
  { href: '/medico/pacientes', label: 'Pacientes',       icon: Users         },
]

export default function MedicoLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/medico/login'

  useEffect(() => {
    if (isLoginPage) return // login es público
    const stored = typeof window !== 'undefined' ? localStorage.getItem('smartSaludUser') : null
    if (!isAuthenticated && !stored) {
      router.push('/login')
      return
    }
    const storedUser = stored ? JSON.parse(stored) : null
    const role = user?.role ?? storedUser?.role
    if (role && role !== 'doctor') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router, isLoginPage])

  // En el login no envolvemos con Header/Footer/Sub-nav: lo renderiza su propia página
  if (isLoginPage) return <>{children}</>

  if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('smartSaludUser')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Sub-navbar médico */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-14">
            <div className="flex items-center gap-2 mr-6 text-emerald-600">
              <Stethoscope className="w-5 h-5" />
              <span className="font-bold text-sm hidden sm:block">Portal Médico</span>
            </div>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-emerald-50 via-blue-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
