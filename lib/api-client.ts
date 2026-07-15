export const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com"}/api/v1`;

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('smartSaludToken');
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Manejar expiración de token si es necesario
    localStorage.removeItem('smartSaludToken');
    localStorage.removeItem('smartSaludUser');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    let errorMsg = 'Error en la petición';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch(e) {
      // Ignorar si no es JSON
    }
    throw new Error(errorMsg);
  }

  // Si la respuesta es 204 No Content, no intentamos parsear JSON
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
