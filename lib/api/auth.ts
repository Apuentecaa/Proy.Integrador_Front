// lib/api/auth.ts
import { api, tokenStorage } from "./client"

export interface MedicoLoginResponse {
  accessToken: string
  refreshToken: string
  tipo: string
  expiresIn: number
  medicoId: number
  nombres: string
  apellidos: string
  email: string
  cmp: string
  especialidad: string
  rol: string
}

export interface MedicoMeResponse {
  id: number
  nombres: string
  apellidos: string
  cmp: string
  especialidad: string
  email: string
  telefono: string | null
  fotoUrl: string | null
  aniosExperiencia: number | null
  descripcionProfesional: string | null
}

export async function loginMedico(email: string, password: string): Promise<MedicoLoginResponse> {
  const res = await api<MedicoLoginResponse>("/api/auth/medico/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  })
  tokenStorage.set(res.accessToken)
  tokenStorage.setRefresh(res.refreshToken)
  return res
}

export async function getMedicoMe(): Promise<MedicoMeResponse> {
  return api<MedicoMeResponse>("/api/auth/medico/me")
}

export function logoutMedico() {
  tokenStorage.clear()
}
