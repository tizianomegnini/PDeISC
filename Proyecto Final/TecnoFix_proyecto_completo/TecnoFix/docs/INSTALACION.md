# Instalación paso a paso (Windows)

## A. MySQL / phpMyAdmin
1. Iniciá MySQL desde XAMPP/WAMP.
2. Abrí phpMyAdmin y ejecutá `database/schema.sql`.
3. Ejecutá después `database/seed.sql`.
4. Si usás otro usuario/contraseña de MySQL, anotá esos datos para el `.env` del backend.

## B. API
1. Abrí una terminal en la carpeta `TecnoFix/backend`.
2. Ejecutá `npm install`.
3. Copiá `.env.example` a `.env`.
4. Configurá `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
5. Cambiá `JWT_SECRET` por una cadena aleatoria larga.
6. Ejecutá `npm run dev`.
7. Comprobá `http://localhost:4000/api/health`.

## C. Expo Go
1. En otra terminal, entrá a `TecnoFix/frontend`.
2. Ejecutá `npm install`.
3. Copiá `.env.example` a `.env`.
4. Buscá la IP IPv4 de la PC con `ipconfig`. Usá una dirección como `http://192.168.1.50:4000/api` en `EXPO_PUBLIC_API_URL`.
5. Permití conexiones privadas al puerto 4000 en el Firewall de Windows.
6. Ejecutá `npx expo start`.
7. Escaneá el QR con la app Expo Go.

El teléfono y la PC deben estar conectados a la misma red. No uses `localhost` en el `.env` del móvil.

## D. APK
Necesitás una cuenta Expo. Desde `frontend/`:
```bash
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```
Al terminar, EAS informa un enlace de descarga del APK. Esta compilación no se puede dar por realizada hasta que el proceso termine sin errores.
