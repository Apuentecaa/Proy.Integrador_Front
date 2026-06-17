// lib/api/catalogo.ts
import { api } from "./client"

export interface Especialidad {
  id: number
  nombre: string
  descripcion: string | null
  iconoUrl: string | null
}

export interface Sede {
  id: number
  nombre: string
  direccion: string
  distrito: string | null
  ciudad: string
  telefono: string | null
}

export interface MedicoListItem {
  id: number
  nombres: string
  apellidos: string
  cmp: string
  especialidadId: number
  especialidadNombre: string
  email: string
  telefono: string | null
  fotoUrl: string | null
  aniosExperiencia: number | null
  descripcionProfesional: string | null
}

export function listarEspecialidades(): Promise<Especialidad[]> {
  return api<Especialidad[]>("/api/especialidad", { auth: false })
}

export function listarSedes(): Promise<Sede[]> {
  return api<Sede[]>("/api/sede", { auth: false })
}

export function listarMedicos(especialidadId?: number): Promise<MedicoListItem[]> {
  const q = especialidadId ? `?especialidadId=${especialidadId}` : ""
  return api<MedicoListItem[]>(`/api/medico${q}`)
}
