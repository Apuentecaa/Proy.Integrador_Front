"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Stethoscope, Phone, Calendar, UserCog, Menu, X, Heart, LogIn, LogOut, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

const navItems = [
  { id: "inicio", label: "Inicio", icon: Home, href: "/" },
  { id: "nosotros", label: "Nosotros", icon: Users, href: "/nosotros" },
  { id: "especialidades", label: "Especialidades", icon: Stethoscope, href: "/especialidades" },
  { id: "contacto", label: "Contacto", icon: Phone, href: "/contacto" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout, user } = useAuth()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center gap-2 hover:opacity-80 transition-opacity" href="/">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Smart Salud
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    active
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                    isActive("/dashboard")
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-transparent"
                      : "text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-all text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                  isActive("/login")
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-transparent"
                    : "text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </Link>
            )}
            <Link
              href="/reservar"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              Reservar Cita
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
              <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-600 border border-gray-200 rounded-lg"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMenuOpen(false)
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 border border-red-200 rounded-lg text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 border border-gray-200 rounded-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </Link>
                )}
                <Link
                  href="/reservar"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Reservar Cita
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
