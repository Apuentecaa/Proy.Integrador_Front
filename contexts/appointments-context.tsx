"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { fetchWithAuth } from '@/lib/api-client'

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
  refreshAppointments: () => Promise<void>
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const { user, isAuthenticated } = useAuth()

  const refreshAppointments = async () => {
    if (!isAuthenticated || user?.role !== 'patient') return;
    
    try {
      const data = await fetchWithAuth('/paciente/historial');
      
      const mappedAppointments: Appointment[] = data.map((cita: any) => {
        // Map backend state to frontend state
        let status: Appointment['status'] = 'confirmed';
        if (cita.estado === 'CANCELADO') status = 'cancelled';
        if (cita.estado === 'PENDIENTE_PAGO') status = 'pending_payment';

        return {
          id: cita.id.toString(),
          specialty: cita.especialidadNombre,
          doctorId: 'mapped-doc',
          doctorName: cita.medicoNombre,
          doctorRating: 5.0,
          doctorExperience: '10 años',
          location: cita.sedeNombre,
          floor: 1,
          room: 'Consultorio 1',
          date: cita.fecha,
          timeSlot: cita.hora.substring(0, 5), // "10:30:00" -> "10:30"
          status: status,
          price: 150.00,
          createdAt: cita.fecha + 'T' + cita.hora,
        };
      });

      setAppointments(mappedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    refreshAppointments();
  }, [isAuthenticated, user]);

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
        refreshAppointments,
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
