"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('smartSaludUser')) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

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
      <main className="flex-1 bg-gradient-to-br from-emerald-50 via-blue-50 to-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
