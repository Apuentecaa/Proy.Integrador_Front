"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export type Role = 'patient' | 'doctor' | 'receptionist' | 'admin' | 'super_admin'

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
  login: (email: string, password: string, role?: Role) => Promise<Role | void>
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
    try {
      // Conexión al Backend de Spring Boot mediante REST API
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const data = await response.json()
      
      // Construimos el objeto del usuario con los datos del backend
      const realUser: User = {
        id: data.id?.toString() || Date.now().toString(),
        name: data.nombre || (email === 'admin@smartsalud.com' ? 'Administrador' : 'Usuario'),
        email: data.email || email,
        phone: data.telefono || '+51 987 654 321',
        role: (data.role as Role) || role || 'patient'
      }
      
      setUser(realUser)
      localStorage.setItem('smartSaludUser', JSON.stringify(realUser))
      if (data.token) {
        localStorage.setItem('smartSaludToken', data.token)
      }
      
      // Determinamos el rol para redirección
      const userRole = realUser.role
      
      // Redirigir según el rol
      if (userRole === 'admin' || userRole === 'super_admin') {
        router.push('/dashboard/admin')
      } else if (userRole === 'doctor') {
        router.push('/dashboard/doctor')
      } else if (userRole === 'receptionist') {
        router.push('/dashboard/receptionist')
      } else {
        router.push('/dashboard/patient')
      }
      
      return userRole
      
    } catch (error) {
      console.error('Error durante el proceso de login:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password, role: 'patient' })
      })

      if (!response.ok) {
        throw new Error('Error en el registro')
      }

      const data = await response.json()
      
      const newUser: User = {
        id: data.id?.toString() || Date.now().toString(),
        name: data.nombre || name,
        email: data.email || email,
        phone: data.telefono || phone,
        role: 'patient'
      }
      
      setUser(newUser)
      localStorage.setItem('smartSaludUser', JSON.stringify(newUser))
      if (data.token) {
        localStorage.setItem('smartSaludToken', data.token)
      }
      
      router.push('/dashboard/patient')
      
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('smartSaludUser')
    localStorage.removeItem('smartSaludToken')
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