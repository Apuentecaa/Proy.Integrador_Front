"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export type Role = 'patient' | 'doctor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role?: Role) => Promise<void>
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Cargar usuario del localStorage al iniciar
    const savedUser = localStorage.getItem('smartSaludUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string, role: Role = 'patient') => {
    // Simulación de login - en producción esto se conectaría a un backend
    // Aquí usamos el rol pasado o 'patient' por defecto. Para los botones hardcodeados, pasaremos el rol explícitamente.
    
    // Determinamos el rol basado en el email si es uno de los hardcodeados
    let assignedRole: Role = role;
    if (email === 'admin@smartsalud.com') assignedRole = 'admin';
    else if (email === 'doctor@smartsalud.com') assignedRole = 'doctor';
    else if (email === 'paciente@smartsalud.com') assignedRole = 'patient';

    const mockUser: User = {
      id: Date.now().toString(),
      name: assignedRole === 'admin' ? 'Administrador' : assignedRole === 'doctor' ? 'Dr. Médico' : 'Paciente Demo',
      email: email,
      phone: '+51 987 654 321',
      role: assignedRole
    }
    
    setUser(mockUser)
    localStorage.setItem('smartSaludUser', JSON.stringify(mockUser))
  }

  const register = async (name: string, email: string, phone: string, password: string) => {
    // Simulación de registro - por defecto se registran pacientes
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: 'patient'
    }
    setUser(newUser)
    localStorage.setItem('smartSaludUser', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('smartSaludUser')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
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
