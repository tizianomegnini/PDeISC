# Login con React Native (Expo Go) + TypeScript + Node.js + MySQL

## 1. Base de datos (XAMPP / WAMP / LAMP)
1. Inicia Apache y MySQL.
2. En phpMyAdmin (http://localhost/phpmyadmin) importa/ejecuta `backend/database.sql`.

## 2. Backend
```bash
cd backend
npm install
cp .env.example .env     # ajusta usuario/clave de MySQL si es necesario
npm run seed             # crea demo@correo.com / 123456
npm start                # API en http://localhost:3000
```
Prueba rápida: http://localhost:3000/api/health

## 3. App Expo
```bash
npx create-expo-app@latest mi-app --template blank-typescript
cd mi-app
```
Copia dentro de `mi-app` el `App.tsx` y la carpeta `src/` de `app/` (reemplaza el App.tsx existente).
Edita `src/config.ts` con la IP de tu PC (ej. http://192.168.1.50:3000).
```bash
npx expo start
```
Escanea el QR con Expo Go (celular y PC en la misma red WiFi).

## Notas
- Si no conecta: permite el puerto 3000 en el firewall de Windows.
- Probar con: demo@correo.com / 123456
