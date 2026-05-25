// lib/api/medico.ts
import { api } from "./client"

export interface CitaMedico {
  id: number
  codigoReserva: string
  fecha: string         // YYYY-MM-DD
  hora: string          // HH:mm:ss
  duracionMin: number
  tipoConsulta: string
  modalidad: string
  estado: "RESERVADO" | "CONFIRMADO" | "ATENDIDO" | "CANCELADO" | "NO_ASISTIO"
  motivoConsulta: string | null
  sede: string | null
  sala: string | null
  pacienteId: number
  pacienteNombres: string
  pacienteApellidos: string
  pacienteDni: string
  pacienteTelefono: string | null
  pacienteEmail: string
}

export interface PacienteMedico {
  id: number
  nombres: string
  apellidos: string
  dni: string
  email: string
  telefono: string | null
  fechaNacimiento: string | null
  sexo: string | null
  totalCitas: number
  ultimaCita: string | null
}

export function getCitasByMedico(medicoId: number) {
  return api<CitaMedico[]>(`/api/medico/${medicoId}/citas`)
}

export function getAgenda(medicoId: number, fecha?: string) {
  const q = fecha ? `?fecha=${fecha}` : ""
  return api<CitaMedico[]>(`/api/medico/${medicoId}/agenda${q}`)
}

export function getAgendaRango(medicoId: number, desde: string, hasta: string) {
  return api<CitaMedico[]>(`/api/medico/${medicoId}/agenda?desde=${desde}&hasta=${hasta}`)
}

export function getPacientesByMedico(medicoId: number) {
  return api<PacienteMedico[]>(`/api/medico/${medicoId}/pacientes`)
}
