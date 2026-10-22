# TecnoFix — Gestión de reparaciones de PC

Aplicación móvil con React Native + Expo Go, API REST con Node.js/Express y base MySQL.
Incluye perfiles `admin`, `tecnico` y `cliente`, autenticación JWT, dispositivos, órdenes de reparación e historial de estados.

> **Estado real del entregable:** proyecto base funcional preparado para instalación local. No se ejecutaron pruebas reales contra una instancia MySQL ni se generó un APK firmado en este entorno. La configuración OAuth social requiere credenciales propias; no se simula como si estuviera activa.

## Requisitos
- Node.js LTS y npm
- MySQL 8+ o MariaDB compatible
- Android con Expo Go (misma Wi-Fi que la PC para conexión local)
- Opcional: cuenta Expo/EAS para construir APK

## Inicio rápido

### 1. Base de datos
1. Crear la base e importar `database/schema.sql` y luego `database/seed.sql` desde phpMyAdmin.
2. El usuario de ejemplo tiene contraseña `password` si se ejecuta el seed. **Cambiala inmediatamente** antes de usar fuera de pruebas.
3. El seed crea usuarios de demostración:
   - admin@tecnofix.local
   - tecnico@tecnofix.local
   - cliente@tecnofix.local
   Contraseña inicial para los tres: `password`

### 2. Backend
```bash
cd backend
npm install
copy .env.example .env
```
Editá `backend/.env` con tus datos MySQL y un secreto JWT largo.
```bash
npm run dev
```
API: `http://localhost:4000/api`; health: `http://localhost:4000/api/health`.

### 3. Frontend / Expo Go
```bash
cd frontend
npm install
copy .env.example .env
```
Editá `frontend/.env` y reemplazá `EXPO_PUBLIC_API_URL` por la IP local de tu PC, por ejemplo `http://192.168.1.50:4000/api`. No uses `localhost` en el celular: apuntaría al propio teléfono.
```bash
npx expo start
```
Escaneá el QR con Expo Go. La PC y el teléfono deben estar en la misma red y el firewall debe permitir el puerto 4000. Si el QR no conecta, probá `npx expo start --tunnel` (esto no crea por sí solo un túnel para la API).

## Crear APK instalable
Desde `frontend/`:
```bash
npm install
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```
El perfil `preview` está configurado para generar APK. EAS compila en la nube y devuelve el enlace cuando termina. El APK **no viene generado dentro de este ZIP** porque requiere ejecutar el build con tu cuenta y comprobarlo.

## Roles
- **Admin:** listado global de órdenes, creación de usuarios y asignación de técnicos.
- **Técnico:** ve órdenes asignadas y puede actualizar estado, diagnóstico y presupuesto.
- **Cliente:** ve sus dispositivos y órdenes; puede registrar dispositivos y solicitar reparaciones.

## Seguridad incluida
- Hash de contraseñas con bcrypt
- JWT de acceso y refresh token en endpoint separado
- Consultas SQL parametrizadas
- Validación de datos y control de roles en servidor
- Helmet, CORS configurable y rate limiting básico
- Respuestas JSON y middleware central de errores

## Límites conocidos
- OAuth Google/Facebook/Apple no está activado sin credenciales y configuración de cada proveedor. La app no muestra botones falsos para esos accesos.
- Refresh token se emite para permitir ampliación de sesión; para producción se recomienda persistir sesiones, rotar y revocar refresh tokens por dispositivo. Esta versión usa una tabla de sesiones y endpoint de renovación/revocación.
- Antes de producción: HTTPS, secretos seguros, backups, pruebas, revisión de permisos y política de privacidad.
