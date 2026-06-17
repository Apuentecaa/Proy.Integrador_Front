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
    try {
      // 1. Conexión Real al Backend de Spring Boot mediante REST API
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Mapeamos el "email" del front al "username" que espera el LoginRequest en Java
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })

      // 2. Si las credenciales son incorrectas (401 u otro error HTTP)
      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const data = await response.json() // El backend retorna {"message": "Login exitoso", "status": "success"}

      // 3. Determinar el rol para mantener la experiencia visual del front
      let assignedRole: Role = role
      if (email === 'admin@smartsalud.com') assignedRole = 'admin'
      else if (email === 'doctor@smartsalud.com') assignedRole = 'doctor'
      else if (email === 'paciente@smartsalud.com') assignedRole = 'patient'

      // Construimos el objeto del usuario usando la respuesta exitosa
      const sessionUser: User = {
        id: Date.now().toString(), // Eventualmente lo reemplazarás por el id real que traiga tu token/backend
        name: assignedRole === 'admin' ? 'Administrador' : assignedRole === 'doctor' ? 'Dr. Médico' : 'Paciente Demo',
        email: email,
        phone: '+51 987 654 321',
        role: assignedRole,
      }

      // 4. Guardamos la sesión localmente
      setUser(sessionUser)
      localStorage.setItem('smartSaludUser', JSON.stringify(sessionUser))

    } catch (error) {
      console.error('Error durante el proceso de login:', error)
      throw error // Lanzamos el error para que el 'toast.error' de la UI lo capture y lo muestre
    }
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