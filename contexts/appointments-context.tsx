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

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem('smartSaludAppointments')
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
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
