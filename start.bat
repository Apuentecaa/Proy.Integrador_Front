@echo off
REM ===================================================================
REM  Smart Salud — Frontend Next.js
REM  Doble click para arrancar. Requiere:
REM   - Node.js instalado
REM   - npm install ya ejecutado (la primera vez)
REM ===================================================================

REM Si no existe .env.local, lo crea desde el example
if not exist .env.local (
    echo Creando .env.local desde .env.local.example...
    copy .env.local.example .env.local >nul
)

REM Si no existe node_modules, instala las dependencias
if not exist node_modules (
    echo Instalando dependencias por primera vez...
    call npm install
)

echo ===================================================================
echo  Arrancando Frontend Next.js...
echo  URL:    http://localhost:3000
echo  Login:  http://localhost:3000/medico/login
echo ===================================================================
echo.

call npm run dev

echo.
echo Frontend detenido. Presiona cualquier tecla para cerrar.
pause >nul
