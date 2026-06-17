"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { listarMedicos, listarEspecialidades, type MedicoListItem, type Especialidad } from '@/lib/api/catalogo'

export interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  experience: string
  availability: string
  nextSlot: string
  status: 'active' | 'inactive'
  patients: number
  floor: number
  room: string
  price: number
  // Campos auxiliares que vienen del backend para llamar API real:
  backendId?: number
  especialidadId?: number
}

interface DoctorsContextType {
  doctors: Doctor[]
  loading: boolean
  usingMock: boolean
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void
  updateDoctor: (id: string, updates: Partial<Doctor>) => void
  deleteDoctor: (id: string) => void
  getDoctor: (id: string) => Doctor | undefined
  getDoctorsBySpecialty: (specialty: string) => Doctor[]
  specialties: string[]
  reload: () => Promise<void>
}

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined)

// Fallback mock para modo demo sin backend
const defaultDoctors: Doctor[] = [
  { id: '1', name: 'Dra. María González', specialty: 'Medicina General', rating: 4.8, experience: '12 años', availability: 'Mañana', nextSlot: 'Hoy 10:00', status: 'active', patients: 45, floor: 2, room: '201', price: 70 },
  { id: '2', name: 'Dr. Carlos Rodríguez', specialty: 'Medicina General', rating: 4.9, experience: '15 años', availability: 'Tarde', nextSlot: 'Mañana 14:30', status: 'active', patients: 52, floor: 2, room: '202', price: 80 },
  { id: '3', name: 'Dr. Luis Fernández', specialty: 'Cardiología', rating: 4.9, experience: '18 años', availability: 'Mañana', nextSlot: 'Hoy 11:00', status: 'active', patients: 38, floor: 3, room: '305', price: 120 },
  { id: '5', name: 'Dra. Sofia López', specialty: 'Pediatría', rating: 5.0, experience: '14 años', availability: 'Mañana', nextSlot: 'Mañana 09:00', status: 'active', patients: 61, floor: 4, room: '410', price: 90 },
  { id: '7', name: 'Dra. Carmen Ruiz', specialty: 'Ginecología', rating: 4.9, experience: '20 años', availability: 'Mañana', nextSlot: 'Mañana 10:30', status: 'active', patients: 67, floor: 3, room: '307', price: 110 },
  { id: '9', name: 'Dr. Roberto Vargas', specialty: 'Dermatología', rating: 4.8, experience: '13 años', availability: 'Mañana', nextSlot: 'Mañana 11:00', status: 'active', patients: 55, floor: 2, room: '203', price: 100 },
]

const defaultSpecialties = ['Medicina General', 'Cardiología', 'Pediatría', 'Ginecología', 'Dermatología', 'Traumatología', 'Neurología']

// Precio fijo por defecto cuando no hay tarifa específica (la BD tiene tarifa_consulta pero no la consultamos aún)
const DEFAULT_PRICE = 80

function mapBackendMedicoToDoctor(m: MedicoListItem): Doctor {
  return {
    id: String(m.id),
    name: `Dr${m.nombres.toLowerCase().startsWith('a') ? 'a' : ''}. ${m.nombres} ${m.apellidos}`,
    specialty: m.especialidadNombre,
    rating: 4.8,
    experience: m.aniosExperiencia ? `${m.aniosExperiencia} años` : '5+ años',
    availability: 'Mañana',
    nextSlot: 'Próximamente',
    status: 'active',
    patients: 0,
    floor: 1,
    room: 'C-101',
    price: DEFAULT_PRICE,
    backendId: m.id,
    especialidadId: m.especialidadId,
  }
}

export function DoctorsProvider({ children }: { children: ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [medicos, especialidades] = await Promise.all([
        listarMedicos(),
        listarEspecialidades(),
      ])
      setDoctors(medicos.map(mapBackendMedicoToDoctor))
      setSpecialties(especialidades.map((e: Especialidad) => e.nombre))
      setUsingMock(false)
    } catch (err) {
      console.warn('Backend no disponible para doctores/especialidades, usando mock', err)
      setDoctors(defaultDoctors)
      setSpecialties(defaultSpecialties)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    const newDoctor: Doctor = {
      ...doctor,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
    }
    setDoctors((prev) => [...prev, newDoctor])
  }

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)))
  }

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== id))
  }

  const getDoctor = (id: string) => doctors.find((doc) => doc.id === id)

  const getDoctorsBySpecialty = (specialty: string) =>
    doctors.filter((doc) => doc.specialty === specialty && doc.status === 'active')

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        loading,
        usingMock,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        getDoctor,
        getDoctorsBySpecialty,
        specialties,
        reload: fetchData,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  )
}

export function useDoctors() {
  const context = useContext(DoctorsContext)
  if (context === undefined) {
    throw new Error('useDoctors must be used within a DoctorsProvider')
  }
  return context
}
