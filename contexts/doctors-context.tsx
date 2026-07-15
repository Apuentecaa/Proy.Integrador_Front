"use client"

import { API_BASE_URL } from "@/lib/api-client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
}

interface DoctorsContextType {
  doctors: Doctor[]
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void
  updateDoctor: (id: string, updates: Partial<Doctor>) => void
  deleteDoctor: (id: string) => void
  getDoctor: (id: string) => Doctor | undefined
  getDoctorsBySpecialty: (specialty: string) => Doctor[]
  specialties: string[]
}

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined)

const defaultDoctors: Doctor[] = [
  { id: '1', name: 'Dra. María González', specialty: 'Medicina General', rating: 4.8, experience: '12 años', availability: 'Mañana', nextSlot: 'Hoy 10:00', status: 'active', patients: 45, floor: 2, room: '201', price: 70 },
  { id: '2', name: 'Dr. Carlos Rodríguez', specialty: 'Medicina General', rating: 4.9, experience: '15 años', availability: 'Tarde', nextSlot: 'Mañana 14:30', status: 'active', patients: 52, floor: 2, room: '202', price: 80 },
  { id: '3', name: 'Dr. Luis Fernández', specialty: 'Cardiología', rating: 4.9, experience: '18 años', availability: 'Mañana', nextSlot: 'Hoy 11:00', status: 'active', patients: 38, floor: 3, room: '305', price: 120 },
  { id: '4', name: 'Dra. Ana Martínez', specialty: 'Cardiología', rating: 4.7, experience: '10 años', availability: 'Tarde', nextSlot: 'Hoy 15:00', status: 'inactive', patients: 0, floor: 3, room: '306', price: 100 },
  { id: '5', name: 'Dra. Sofia López', specialty: 'Pediatría', rating: 5.0, experience: '14 años', availability: 'Mañana', nextSlot: 'Mañana 09:00', status: 'active', patients: 61, floor: 4, room: '410', price: 90 },
  { id: '6', name: 'Dr. Pedro Sánchez', specialty: 'Pediatría', rating: 4.8, experience: '16 años', availability: 'Tarde', nextSlot: 'Hoy 16:00', status: 'active', patients: 48, floor: 4, room: '411', price: 85 },
  { id: '7', name: 'Dra. Carmen Ruiz', specialty: 'Ginecología', rating: 4.9, experience: '20 años', availability: 'Mañana', nextSlot: 'Mañana 10:30', status: 'active', patients: 67, floor: 3, room: '307', price: 110 },
  { id: '8', name: 'Dra. Isabel Torres', specialty: 'Ginecología', rating: 4.7, experience: '11 años', availability: 'Tarde', nextSlot: 'Hoy 14:00', status: 'active', patients: 42, floor: 3, room: '308', price: 95 },
  { id: '9', name: 'Dr. Roberto Vargas', specialty: 'Dermatología', rating: 4.8, experience: '13 años', availability: 'Mañana', nextSlot: 'Mañana 11:00', status: 'active', patients: 55, floor: 2, room: '203', price: 100 },
  { id: '10', name: 'Dra. Patricia Morales', specialty: 'Dermatología', rating: 4.9, experience: '17 años', availability: 'Tarde', nextSlot: 'Hoy 15:30', status: 'active', patients: 59, floor: 2, room: '204', price: 105 },
]

export function DoctorsProvider({ children }: { children: ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/medicos`)
        if (response.ok) {
          const data = await response.json()
          const mappedDoctors: Doctor[] = data.map((medico: any) => ({
            id: medico.id.toString(),
            name: `Dr. ${medico.nombres} ${medico.apellidos}`,
            specialty: medico.especialidadNombre,
            rating: 4.8, // Mocked rating for now
            experience: `${medico.aniosExperiencia} años`,
            availability: 'Mañana y Tarde',
            nextSlot: 'Consultar horarios',
            status: 'active',
            patients: 0,
            floor: 2,
            room: '201',
            price: 150
          }))
          setDoctors(mappedDoctors)
        } else {
          // Fallback to defaults if backend fails
          setDoctors(defaultDoctors)
        }
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setDoctors(defaultDoctors)
      }
    }
    fetchDoctors()
  }, [])

  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    // Note: Should call POST /api/v1/medicos in real implementation
    const newDoctor: Doctor = {
      ...doctor,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
    }
    setDoctors((prev) => [...prev, newDoctor])
  }

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    )
  }

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== id))
  }

  const getDoctor = (id: string) => {
    return doctors.find((doc) => doc.id === id)
  }

  const getDoctorsBySpecialty = (specialty: string) => {
    return doctors.filter((doc) => doc.specialty === specialty && doc.status === 'active')
  }

  const specialties = Array.from(new Set(doctors.map((doc) => doc.specialty))).sort()

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        getDoctor,
        getDoctorsBySpecialty,
        specialties,
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
