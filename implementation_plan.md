# Implementación de CRUD para Médicos y Otros Usuarios

Este plan detalla cómo implementaremos la gestión de **Médicos** y **Otros Usuarios** (Administradores, Recepcionistas) en el Panel de Administración (Frontend) y en el Backend, respetando estrictamente la base de datos original y sin crear nuevas tablas.

## User Review Required

> [!IMPORTANT]
> **Estrategia de Autenticación con la BD Actual**
>
> Al revisar el script de la base de datos original, notamos lo siguiente:
> 1. La tabla `medico` **no tiene** una columna para la contraseña (`password_hash`).
> 2. La tabla `paciente` **sí tiene** la columna `password_hash`, `email`, y `ultimo_acceso`.
> 3. No existen tablas dedicadas para "Administradores" o "Recepcionistas".
>
> Dado el requerimiento de **no modificar ni crear nuevas tablas**, la única forma arquitectónicamente posible de permitir que los Médicos y Otros Usuarios inicien sesión es utilizar la tabla `paciente` como la **tabla central de credenciales** para todo el sistema (tal como lo hicimos en el script de prueba anterior).

Por lo tanto, la lógica de creación será la siguiente:

1. **Para Otros Usuarios (Admins, Recepcionistas):**
   - Se creará un registro en la tabla `paciente` (para sus datos de acceso y contraseña).
   - Se enlazará en la tabla `usuario_rol` con el rol correspondiente (ADMIN o RECEPCIONISTA).

2. **Para Médicos:**
   - Se creará el perfil profesional en la tabla `medico` (para manejar su CMP, especialidad, sedes y para que aparezcan en el catálogo de citas).
   - Se creará un registro paralelo en la tabla `paciente` (exclusivamente para que puedan iniciar sesión).
   - Se enlazará en la tabla `usuario_rol` con el rol MEDICO.

## Proposed Changes

### 1. Backend (Controladores y Servicios)

#### [MODIFY] `AdminController.java` & `AdminService.java`
- Se añadirán endpoints para gestionar **Usuarios Administrativos** (CRUD de Recepcionistas y Administradores).
- Se añadirán endpoints para el **CRUD de Médicos**, el cual se encargará de crear simultáneamente el perfil en la tabla `medico` y las credenciales en la tabla `paciente`.

#### [MODIFY] `MedicoController.java` & `MedicoService.java`
- Se ajustarán para soportar la creación, edición y eliminación (soft-delete o desactivación) requeridas por el panel de administrador.

### 2. Frontend (Panel de Administración)

#### [MODIFY] `app/admin/page.tsx`
- **Reestructuración de Pestañas (Tabs):** Se actualizarán las pestañas para incluir:
  - `Médicos`: CRUD de la tabla `medico`.
  - `Usuarios`: CRUD para Administradores y Recepcionistas.
  - `Citas` y `Reportes` (existentes).
- **Interfaz de Médicos:** Se conectará el modal actual de "Agregar/Editar Médico" con los endpoints reales del backend. Se añadirán campos requeridos como DNI, CMP, Email y Contraseña (para generar su acceso).
- **Nueva Interfaz de Usuarios:** Se creará una tabla y un modal similar al de médicos, pero enfocado en crear usuarios administrativos (pidiendo DNI, Nombres, Apellidos, Email, Contraseña y el Rol a asignar).

## Open Questions

> [!WARNING]
> **Relación Médico-Sede**
> La base de datos requiere que un médico esté asociado a una o más sedes (`medico_sede`) y que tenga una especialidad (`especialidad_id`). En el formulario de creación de médicos del Frontend:
> ¿Deseas que al crear el médico se le asigne a una sede por defecto de las que ya existen, o agregamos un selector múltiple de sedes en el formulario?

## Verification Plan

1. **Automated / Manual Testing:**
   - Iniciar sesión como Admin.
   - Ir a la pestaña "Usuarios" y crear un nuevo Recepcionista.
   - Cerrar sesión e intentar iniciar sesión con el nuevo Recepcionista (verificando que la contraseña funciona).
   - Ir a la pestaña "Médicos" y crear un Médico nuevo.
   - Verificar que el médico aparece en la vista de Pacientes al momento de reservar una cita.
   - Iniciar sesión con las credenciales del Médico recién creado.
