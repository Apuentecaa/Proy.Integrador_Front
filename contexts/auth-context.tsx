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
  register: (name: string, apellidos: string, email: string, phone: string, dni: string, password: string) => Promise<void>
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
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      
      const realUser: User = {
        id: data.id.toString(),
        name: data.nombre,
        email: data.email,
        phone: 'Registrado en BD',
        role: data.role as Role || 'patient'
      }
      
      setUser(realUser)
      localStorage.setItem('smartSaludUser', JSON.stringify(realUser))
      localStorage.setItem('smartSaludToken', data.token) // Guardamos el JWT
      return realUser.role; // Returning role so login page can redirect accordingly
    } catch (error) {
      console.error("Login falló:", error);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
      throw error;
    }
  }

  const register = async (name: string, apellidos: string, email: string, phone: string, dni: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombres: name, apellidos, email, telefono: phone, dni, password })
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }

      const data = await response.json();
      
      const newUser: User = {
        id: data.id.toString(),
        name: data.nombre,
        email: data.email,
        phone: phone,
        role: data.role as Role || 'patient'
      }
      
      setUser(newUser)
      localStorage.setItem('smartSaludUser', JSON.stringify(newUser))
      localStorage.setItem('smartSaludToken', data.token)
    } catch (error) {
      console.error("Registro falló:", error);
      throw error;
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
