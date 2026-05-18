"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Appointment {
  id: string
  specialty: string
  doctorId: string
  doctorName: string
  doctorRating: number
  doctorExperience: string
  location: string
  floor: number
  room: string
  date: string // ISO string
  timeSlot: string
  status: 'pending_payment' | 'confirmed' | 'cancelled'
  paymentMethod?: string
  paymentStatus?: 'pending' | 'completed' | 'failed'
  price: number
  createdAt: string // ISO string
  reminderSent?: boolean
}

interface AppointmentsContextType {
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  cancelAppointment: (id: string) => void
  getAppointment: (id: string) => Appointment | undefined
  getPendingPaymentAppointment: () => Appointment | undefined
}

const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    specialty: 'Medicina General',
    doctorId: 'doc-1',
    doctorName: 'Dra. María González',
    doctorRating: 4.8,
    doctorExperience: '12 años',
    location: 'Policlínico Smart Salud - Ate',
    floor: 2,
    room: 'Consultorio 204',
    date: (() => {
      const d = new Date()
      d.setDate(d.getDate() + 1) // Tomorrow
      return d.toISOString().split('T')[0]
    })(),
    timeSlot: '10:00',
    status: 'confirmed',
    paymentMethod: 'card',
    paymentStatus: 'completed',
    price: 50.00,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'apt-2',
    specialty: 'Cardiología',
    doctorId: 'doc-3',
    doctorName: 'Dr. Luis Fernández',
    doctorRating: 4.9,
    doctorExperience: '18 años',
    location: 'Policlínico Smart Salud - Ate',
    floor: 3,
    room: 'Consultorio 301',
    date: (() => {
      const d = new Date()
      d.setDate(d.getDate() + 3) // In 3 days
      return d.toISOString().split('T')[0]
    })(),
    timeSlot: '11:00',
    status: 'pending_payment',
    paymentMethod: 'transfer',
    paymentStatus: 'pending',
    price: 70.00,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'apt-3',
    specialty: 'Pediatría',
    doctorId: 'doc-4',
    doctorName: 'Dra. Sofia López',
    doctorRating: 5.0,
    doctorExperience: '14 años',
    location: 'Policlínico Smart Salud - Ate',
    floor: 1,
    room: 'Consultorio 102',
    date: (() => {
      const d = new Date()
      d.setDate(d.getDate() - 5) // 5 days ago
      return d.toISOString().split('T')[0]
    })(),
    timeSlot: '09:00',
    status: 'confirmed',
    paymentMethod: 'card',
    paymentStatus: 'completed',
    price: 45.00,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  }
]

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem('smartSaludAppointments')
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    } else {
      setAppointments(mockAppointments)
      localStorage.setItem('smartSaludAppointments', JSON.stringify(mockAppointments))
    }
  }, [])

  useEffect(() => {
    // Save appointments to localStorage whenever they change
    if (appointments.length > 0) {
      localStorage.setItem('smartSaludAppointments', JSON.stringify(appointments))
    }
  }, [appointments])

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    }
    setAppointments((prev) => [...prev, newAppointment])
    return newAppointment
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
    )
  }

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' as const } : apt))
    )
  }

  const getAppointment = (id: string) => {
    return appointments.find((apt) => apt.id === id)
  }

  const getPendingPaymentAppointment = () => {
    return appointments.find((apt) => apt.status === 'pending_payment')
  }

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        getAppointment,
        getPendingPaymentAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider')
  }
  return context
}
