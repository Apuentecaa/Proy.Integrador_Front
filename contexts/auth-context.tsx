"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  loginMedico as apiLoginMedico,
  loginPaciente as apiLoginPaciente,
  registerPaciente as apiRegisterPaciente,
  getPacienteMe,
  logoutMedico as apiLogout,
} from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'

export type Role = 'patient' | 'doctor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  // Médico
  medicoId?: number
  cmp?: string
  especialidad?: string
  // Paciente
  pacienteId?: number
  dni?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role?: Role) => Promise<void>
  loginMedico: (email: string, password: string) => Promise<void>
  loginAdmin: (email: string, password: string) => Promise<void>
  register: (
    nombres: string,
    apellidos: string,
    dni: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('smartSaludUser')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  // Login paciente — backend real con fallback a demo si las credenciales son las hardcodeadas
  const login = async (email: string, password: string, role: Role = 'patient') => {
    // Credenciales demo legacy (admin/doctor/paciente@smartsalud.com) → mock
    const isDemo =
      email === 'admin@smartsalud.com' ||
      email === 'doctor@smartsalud.com' ||
      email === 'paciente@smartsalud.com'

    if (isDemo) {
      let assignedRole: Role = role
      if (email === 'admin@smartsalud.com') assignedRole = 'admin'
      else if (email === 'doctor@smartsalud.com') assignedRole = 'doctor'
      else assignedRole = 'patient'
      const mockUser: User = {
        id: Date.now().toString(),
        name:
          assignedRole === 'admin'
            ? 'Administrador'
            : assignedRole === 'doctor'
            ? 'Dr. Médico'
            : 'Paciente Demo',
        email,
        phone: '+51 987 654 321',
        role: assignedRole,
      }
      setUser(mockUser)
      localStorage.setItem('smartSaludUser', JSON.stringify(mockUser))
      return
    }

    // Login REAL contra backend
    await apiLoginPaciente(email, password)
    const me = await getPacienteMe()
    const pacienteUser: User = {
      id: String(me.id),
      name: `${me.nombres} ${me.apellidos}`,
      email: me.email,
      phone: me.telefono ?? '',
      role: 'patient',
      pacienteId: me.id,
      dni: me.dni,
    }
    setUser(pacienteUser)
    localStorage.setItem('smartSaludUser', JSON.stringify(pacienteUser))
  }

  // Login REAL del médico
  const loginMedico = async (email: string, password: string) => {
    const res = await apiLoginMedico(email, password)
    const medicoUser: User = {
      id: String(res.medicoId),
      name: `Dr. ${res.nombres} ${res.apellidos}`,
      email: res.email,
      phone: '',
      role: 'doctor',
      medicoId: res.medicoId,
      cmp: res.cmp,
      especialidad: res.especialidad,
    }
    setUser(medicoUser)
    localStorage.setItem('smartSaludUser', JSON.stringify(medicoUser))
  }

  // Login de administrador (prefijo "ow"). El admin no vive en la BD aún:
  // se crea una sesión de administrador. Requiere la clave maestra.
  const loginAdmin = async (email: string, password: string) => {
    if (password !== 'Admin123' && password !== 'Password123') {
      throw new Error('Clave de administrador incorrecta')
    }
    const adminUser: User = {
      id: 'admin',
      name: 'Administrador',
      email,
      phone: '',
      role: 'admin',
    }
    setUser(adminUser)
    localStorage.setItem('smartSaludUser', JSON.stringify(adminUser))
  }

  // Registro REAL del paciente
  const register = async (
    nombres: string,
    apellidos: string,
    dni: string,
    email: string,
    phone: string,
    password: string,
  ) => {
    await apiRegisterPaciente({ nombres, apellidos, dni, email, telefono: phone, password })
    const me = await getPacienteMe()
    const newUser: User = {
      id: String(me.id),
      name: `${me.nombres} ${me.apellidos}`,
      email: me.email,
      phone: me.telefono ?? '',
      role: 'patient',
      pacienteId: me.id,
      dni: me.dni,
    }
    setUser(newUser)
    localStorage.setItem('smartSaludUser', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    apiLogout()
    localStorage.removeItem('smartSaludUser')
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginMedico,
        loginAdmin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
