// lib/api/pago.ts
import { api } from "./client"

export type MetodoPago =
  | "EFECTIVO"
  | "TARJETA_CREDITO"
  | "TARJETA_DEBITO"
  | "YAPE"
  | "PLIN"
  | "TRANSFERENCIA"
  | "SEGURO_MEDICO"

export interface Pago {
  id: number
  citaId: number
  monto: number
  moneda: string
  metodo: MetodoPago
  estado: "PENDIENTE" | "COMPLETADO" | "FALLIDO" | "REEMBOLSADO"
  referenciaExterna: string | null
  fecha: string
  fechaConfirmacion: string | null
  intentos: number
}

export interface CrearPagoRequest {
  citaId: number
  monto: number
  metodo: MetodoPago
  moneda?: string
  referenciaExterna?: string
}

export function procesarPago(data: CrearPagoRequest): Promise<Pago> {
  return api<Pago>("/api/pago", { method: "POST", body: data })
}

export function obtenerPagoCita(citaId: number): Promise<Pago> {
  return api<Pago>(`/api/pago/cita/${citaId}`)
}

export function listarPagosPaciente(pacienteId: number): Promise<Pago[]> {
  return api<Pago[]>(`/api/pago/paciente/${pacienteId}`)
}
