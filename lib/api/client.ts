// lib/api/client.ts
// Cliente HTTP minimalista basado en fetch + JWT en localStorage

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

const TOKEN_KEY = "smartSaludToken"
const REFRESH_TOKEN_KEY = "smartSaludRefreshToken"

export const tokenStorage = {
  get:  ()        => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set:  (t: string) => { if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, t) },
  clear: ()       => { if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }},
  setRefresh: (t: string) => { if (typeof window !== "undefined") localStorage.setItem(REFRESH_TOKEN_KEY, t) },
  getRefresh: ()          => (typeof window === "undefined" ? null : localStorage.getItem(REFRESH_TOKEN_KEY)),
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public payload?: unknown) {
    super(message)
  }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  auth?: boolean // por defecto true
}

export async function api<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = opts

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...((headers as Record<string, string>) ?? {}),
  }

  if (auth) {
    const token = tokenStorage.get()
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new ApiError(0, "No se pudo conectar con el servidor. ¿Está corriendo el backend?")
  }

  if (response.status === 204) return undefined as T

  const text = await response.text()
  let parsed: unknown = null
  if (text) {
    try { parsed = JSON.parse(text) } catch { parsed = text }
  }

  if (!response.ok) {
    const msg =
      (parsed as { message?: string } | null)?.message ??
      `Error ${response.status}`
    throw new ApiError(response.status, msg, parsed)
  }

  return parsed as T
}

export { API_URL }
