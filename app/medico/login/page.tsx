"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Stethoscope, Loader2, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"

// Credenciales seed del script add-medico-auth.sql (password "Password123")
const CUENTAS_MEDICOS = [
  { email: "c.mendoza@vidasalud.pe",  name: "Dr. Carlos Mendoza",  spec: "Medicina General" },
  { email: "l.paredes@vidasalud.pe",  name: "Dr. Luis Paredes",    spec: "Cardiología"     },
  { email: "m.flores@vidasalud.pe",   name: "Dr. Miguel Flores",   spec: "Pediatría"       },
]

export default function MedicoLoginPage() {
  const router = useRouter()
  const { loginMedico } = useAuth()
  const [email, setEmail] = useState("c.mendoza@vidasalud.pe")
  const [password, setPassword] = useState("Password123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await loginMedico(email, password)
      toast.success("Bienvenido al Portal Médico")
      router.push("/medico/citas")
    } catch (err) {
      const msg = err instanceof ApiError
        ? err.message
        : "Error inesperado. Intenta de nuevo."
      setError(msg)
      toast.error("No se pudo iniciar sesión", { description: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver al login general
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header gradiente */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold">Portal Médico</h1>
            <p className="text-sm text-white/80 mt-1">Smart Salud — Acceso para profesionales</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold shadow-md hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Stethoscope className="w-4 h-4" />}
              {loading ? "Verificando..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Accesos rápidos */}
          <div className="px-6 pb-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <p className="text-xs font-bold text-emerald-700 mb-2">Cuentas de médicos</p>
              <div className="space-y-1.5">
                {CUENTAS_MEDICOS.map(c => (
                  <button
                    key={c.email}
                    type="button"
                    onClick={() => { setEmail(c.email); setPassword("Password123") }}
                    className="w-full text-left text-xs p-2 rounded-lg hover:bg-white transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{c.name}</p>
                      <p className="text-gray-500 truncate">{c.email}</p>
                    </div>
                    <span className="text-emerald-600 shrink-0">{c.spec}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-emerald-600 mt-2 font-mono">Password: Password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
