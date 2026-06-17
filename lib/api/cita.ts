// lib/api/cita.ts
import { api } from "./client"

export interface CitaPaciente {
  id: number
  codigoReserva: string
  fecha: string         // YYYY-MM-DD
  hora: string          // HH:mm:ss
  duracionMin: number
  tipoConsulta: string
  modalidad: string
  estado: "RESERVADO" | "CONFIRMADO" | "ATENDIDO" | "CANCELADO" | "NO_ASISTIO"
  motivoConsulta: string | null
  medicoId: number
  medicoNombres: string
  medicoApellidos: string
  especialidad: string
  sedeId: number
  sedeNombre: string | null
  pacienteId: number
  pacienteNombres: string
  pacienteApellidos: string
  fechaCreacion: string | null
  fechaCancelacion: string | null
  motivoCancelacion: string | null
}

export interface CrearCitaRequest {
  pacienteId: number
  medicoId: number
  sedeId: number
  fecha: string   // YYYY-MM-DD
  hora: string    // HH:mm
  duracionMin?: number
  tipoConsulta?: string
  modalidad?: string
  motivoConsulta?: string
}

export interface SlotDisponible {
  fecha: string
  hora: string
  duracionMin: number
  medicoId: number
  sedeId: number
  sedeNombre: string
  disponible: boolean
}

export function crearCita(data: CrearCitaRequest): Promise<CitaPaciente> {
  return api<CitaPaciente>("/api/cita", { method: "POST", body: data })
}

export function obtenerCita(id: number): Promise<CitaPaciente> {
  return api<CitaPaciente>(`/api/cita/${id}`)
}

export function listarCitasPaciente(pacienteId: number): Promise<CitaPaciente[]> {
  return api<CitaPaciente[]>(`/api/cita/paciente/${pacienteId}`)
}

export function cancelarCita(id: number, motivo: string, canceladoPor = "PACIENTE"): Promise<CitaPaciente> {
  return api<CitaPaciente>(`/api/cita/${id}/cancelar`, {
    method: "PUT",
    body: { motivo, canceladoPor },
  })
}

export function listarSlotsDisponibles(medicoId: number, fecha: string): Promise<SlotDisponible[]> {
  return api<SlotDisponible[]>(`/api/horario/disponibles?medicoId=${medicoId}&fecha=${fecha}`)
}
