"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useAuth } from './auth-context'
import {
  listarCitasPaciente,
  crearCita,
  cancelarCita as apiCancelarCita,
  type CitaPaciente,
  type CrearCitaRequest,
} from '@/lib/api/cita'

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
  date: string // ISO date YYYY-MM-DD
  timeSlot: string // HH:mm
  status: 'pending_payment' | 'confirmed' | 'cancelled'
  paymentMethod?: string
  paymentStatus?: 'pending' | 'completed' | 'failed'
  price: number
  createdAt: string
  reminderSent?: boolean
  // Para llamar a la API real
  backendId?: number
  backendMedicoId?: number
  backendSedeId?: number
}

interface AppointmentsContextType {
  appointments: Appointment[]
  loading: boolean
  usingMock: boolean
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<Appointment>
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  cancelAppointment: (id: string, motivo?: string) => Promise<void>
  getAppointment: (id: string) => Appointment | undefined
  getPendingPaymentAppointment: () => Appointment | undefined
  reload: () => Promise<void>
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

// Mapeo del estado backend → frontend
function mapEstado(estado: CitaPaciente["estado"]): Appointment["status"] {
  switch (estado) {
    case 'RESERVADO': return 'pending_payment'
    case 'CONFIRMADO':
    case 'ATENDIDO': return 'confirmed'
    case 'CANCELADO':
    case 'NO_ASISTIO': return 'cancelled'
  }
}

function mapCitaToAppointment(c: CitaPaciente): Appointment {
  return {
    id: String(c.id),
    specialty: c.especialidad,
    doctorId: String(c.medicoId),
    doctorName: `Dr. ${c.medicoNombres} ${c.medicoApellidos}`,
    doctorRating: 4.8,
    doctorExperience: '10+ años',
    location: c.sedeNombre ?? 'Sede Central',
    floor: 1,
    room: 'C-101',
    date: c.fecha,
    timeSlot: c.hora.substring(0, 5),
    status: mapEstado(c.estado),
    price: 80,
    createdAt: c.fechaCreacion ?? new Date().toISOString(),
    backendId: c.id,
    backendMedicoId: c.medicoId,
    backendSedeId: c.sedeId,
  }
}

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [usingMock, setUsingMock] = useState(false)

  const fetchData = useCallback(async () => {
    if (!user?.pacienteId) {
      setAppointments([])
      return
    }
    setLoading(true)
    try {
      const citas = await listarCitasPaciente(user.pacienteId)
      setAppointments(citas.map(mapCitaToAppointment))
      setUsingMock(false)
    } catch (err) {
      console.warn('Backend no disponible para citas, lista vacía', err)
      setAppointments([])
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }, [user?.pacienteId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const addAppointment = async (a: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> => {
    if (!user?.pacienteId) {
      throw new Error('Debes iniciar sesión como paciente para reservar')
    }
    const medicoId = a.backendMedicoId ?? Number(a.doctorId)
    if (Number.isNaN(medicoId)) {
      throw new Error('El médico seleccionado no tiene un ID válido del backend')
    }
    const req: CrearCitaRequest = {
      pacienteId: user.pacienteId,
      medicoId,
      sedeId: a.backendSedeId ?? 1, // Default Sede Central
      fecha: a.date.length > 10 ? a.date.substring(0, 10) : a.date,
      hora: a.timeSlot.length === 5 ? `${a.timeSlot}:00` : a.timeSlot,
      tipoConsulta: 'PRIMERA_VEZ',
      modalidad: 'PRESENCIAL',
    }
    const cita = await crearCita(req)
    const mapped = mapCitaToAppointment(cita)
    setAppointments((prev) => [mapped, ...prev])
    return mapped
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt)))
  }

  const cancelAppointment = async (id: string, motivo = 'Cancelada por el paciente') => {
    const apt = appointments.find((a) => a.id === id)
    if (apt?.backendId) {
      try {
        await apiCancelarCita(apt.backendId, motivo)
      } catch (err) {
        console.warn('Error al cancelar cita en backend, marca local solamente', err)
      }
    }
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' as const } : apt))
    )
  }

  const getAppointment = (id: string) => appointments.find((apt) => apt.id === id)
  const getPendingPaymentAppointment = () => appointments.find((apt) => apt.status === 'pending_payment')

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        loading,
        usingMock,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        getAppointment,
        getPendingPaymentAppointment,
        reload: fetchData,
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
