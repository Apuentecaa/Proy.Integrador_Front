// lib/api/historial.ts
import { api } from "./client"

export interface HistorialClinico {
  id: number
  pacienteId: number
  medicoId: number
  citaId: number | null
  fecha: string
  motivoConsulta: string | null
  diagnostico: string | null
  tratamiento: string | null
  observaciones: string | null
  proximaCita: string | null
  creadoEn: string
}

export interface CrearHistorialRequest {
  pacienteId: number
  medicoId: number
  citaId?: number
  fecha?: string
  motivoConsulta?: string
  diagnostico?: string
  tratamiento?: string
  observaciones?: string
  proximaCita?: string
}

export function crearHistorial(data: CrearHistorialRequest): Promise<HistorialClinico> {
  return api<HistorialClinico>("/api/historial", { method: "POST", body: data })
}

export function listarHistorialPaciente(pacienteId: number): Promise<HistorialClinico[]> {
  return api<HistorialClinico[]>(`/api/historial/paciente/${pacienteId}`)
}
