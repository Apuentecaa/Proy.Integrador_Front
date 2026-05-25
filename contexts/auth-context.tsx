"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { loginMedico as apiLoginMedico, logoutMedico as apiLogout } from '@/lib/api/auth'

export type Role = 'patient' | 'doctor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  // Solo para médicos autenticados contra el backend real
  medicoId?: number
  cmp?: string
  especialidad?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role?: Role) => Promise<void>
  loginMedico: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
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

  // Login mock (paciente / admin demo)
  const login = async (email: string, password: string, role: Role = 'patient') => {
    let assignedRole: Role = role
    if (email === 'admin@smartsalud.com')   assignedRole = 'admin'
    else if (email === 'doctor@smartsalud.com') assignedRole = 'doctor'
    else if (email === 'paciente@smartsalud.com') assignedRole = 'patient'

    const mockUser: User = {
      id: Date.now().toString(),
      name: assignedRole === 'admin' ? 'Administrador'
          : assignedRole === 'doctor' ? 'Dr. Médico'
          : 'Paciente Demo',
      email,
      phone: '+51 987 654 321',
      role: assignedRole,
    }
    setUser(mockUser)
    localStorage.setItem('smartSaludUser', JSON.stringify(mockUser))
  }

  // Login REAL contra el backend Spring Boot
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

  const register = async (name: string, email: string, phone: string, _password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name, email, phone,
      role: 'patient',
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
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      loginMedico,
      register,
      logout,
    }}>
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
