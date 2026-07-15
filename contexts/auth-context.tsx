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
  register: (name: string, email: string, phone: string, password: string, dni: string) => Promise<void>
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com";
      const endpointUrl = baseUrl.endsWith('/api/v1') ? `${baseUrl}/auth/login` : `${baseUrl}/api/v1/auth/login`;

      // Conexión al Backend de Spring Boot mediante REST API
      const response = await fetch(endpointUrl, {
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
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
      
      return userRole
      
    } catch (error) {
      console.error('Error durante el proceso de login:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, phone: string, password: string, dni: string) => {
    try {
      const parts = name.trim().split(' ')
      const nombres = parts[0] || name
      const apellidos = parts.slice(1).join(' ') || '.' // Require not null
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com";
      const endpointUrl = baseUrl.endsWith('/api/v1') ? `${baseUrl}/auth/register` : `${baseUrl}/api/v1/auth/register`;
      
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombres, apellidos, email, telefono: phone, password, dni })
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