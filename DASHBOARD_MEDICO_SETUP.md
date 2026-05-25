# Dashboard Médico — Frontend

Esta rama (`edu-dashboard-medico`) agrega las rutas `/medico/*` del Portal del
Médico y un cliente HTTP que se conecta al backend Spring Boot del repo
`backend_SmartSalud` (rama `edu/dashboard-medico`).

## 1. Variables de entorno

Copia `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

Por defecto apunta a `http://localhost:8080`. Cámbialo si tu backend corre en
otro puerto/host.

## 2. Arrancar el frontend

```bash
pnpm install   # o npm install / yarn
pnpm dev       # o npm run dev
```

Frontend en **http://localhost:3000**.

## 3. Flujo

1. **Visita `/medico/login`** (botones precargados con las credenciales seed).
2. Haz login con `c.mendoza@vidasalud.pe` / `Password123` (necesitas el backend
   y la base de datos corriendo — ver `backend_SmartSalud/DASHBOARD_MEDICO_SETUP.md`).
3. Una vez logueado serás redirigido a `/medico/citas` y verás:
   - **`/medico/citas`** — Cola de atención (citas reales del médico)
   - **`/medico/agenda`** — Agenda semanal con slots de 30 min
   - **`/medico/pacientes`** — Pacientes atendidos con su historial

## 4. Modo demo (sin backend)

Si el backend no está disponible, cada página detecta el error y muestra un
banner ámbar **"Modo demo"** con datos mock — así puedes ver la UI sin tener
que levantar Postgres.

## 5. Estructura nueva

```
app/medico/
  ├── layout.tsx        ← navbar + guard de rol "doctor" (excluye /medico/login)
  ├── page.tsx          ← redirect → /medico/citas
  ├── login/page.tsx    ← login específico de médicos con seed precargado
  ├── citas/page.tsx    ← cola de atención + modal de registro clínico
  ├── agenda/page.tsx   ← agenda semanal con slots
  └── pacientes/page.tsx ← directorio de pacientes con detalle y documentos

lib/api/
  ├── client.ts         ← fetch wrapper con manejo de JWT y errores tipados
  ├── auth.ts           ← loginMedico(), getMedicoMe(), logoutMedico()
  └── medico.ts         ← getCitasByMedico(), getAgenda(), getPacientesByMedico()

contexts/auth-context.tsx ← ahora expone loginMedico() además del login mock
```

## 6. Cómo se autentica

1. `loginMedico(email, pwd)` llama `POST /api/auth/medico/login`.
2. La respuesta trae `accessToken` (JWT) + datos del médico.
3. El token se guarda en `localStorage` como `smartSaludToken`.
4. Las siguientes llamadas del cliente API agregan automáticamente el header
   `Authorization: Bearer <token>`.
5. El backend valida el JWT con `JwtAuthenticationFilter` y aplica
   `@PreAuthorize("hasRole('MEDICO')")` en el controller.
