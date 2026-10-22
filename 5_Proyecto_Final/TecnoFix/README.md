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

El APK necesita que el backend esté desplegado en una URL HTTPS pública y accesible desde el teléfono. Una IP privada como `192.168.x.x` sirve para pruebas en la misma Wi-Fi, pero no para una instalación que deba funcionar fuera de esa red.

Configurá la variable `EXPO_PUBLIC_API_URL` en **EAS > Project > Environment variables**, asignada al entorno `preview`, con la URL terminada en `/api` (por ejemplo `https://api.tudominio.com/api`). No cargues secretos del backend en variables `EXPO_PUBLIC_*`.

Desde `frontend/`:
```bash
npm ci
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```
El perfil `preview` genera un APK de distribución interna y EAS devuelve el enlace cuando finaliza. La firma Android se puede crear con las credenciales administradas por EAS.

### Version de Expo Go

El frontend usa Expo SDK 57. Actualiza Expo Go desde Google Play antes de escanear el QR. Si Play Store todavia no ofrece la version compatible, instala la version Android para SDK 57 desde https://expo.dev/go.
