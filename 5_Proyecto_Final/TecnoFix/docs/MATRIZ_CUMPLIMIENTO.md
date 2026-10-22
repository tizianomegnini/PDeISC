# Matriz de cumplimiento

| Requisito | Implementación | Estado / nota |
|---|---|---|
| React Native + Expo Go | `frontend/` Expo SDK 53 | Preparado; instalar dependencias y probar en dispositivo |
| APK Android | `eas.json` perfil `preview` con `buildType: apk` | Requiere ejecutar EAS con cuenta; APK no incluido |
| Backend Node + Express | `backend/src` | Implementado |
| MySQL | `database/schema.sql` | Implementado; conexión local por configurar |
| Roles admin/técnico/cliente | Middleware y consultas filtradas | Implementado |
| Registro / login | bcrypt + JWT | Implementado |
| Persistencia de sesión | AsyncStorage + refresh token rotativo | Implementado |
| OAuth Google/Facebook/Apple | No activado | Requiere client IDs, secretos y verificación del proveedor |
| Dispositivos | CRUD básico de alta/listado | Parcial: falta edición/eliminación visual |
| Solicitudes de reparación | Crear/listar órdenes | Implementado |
| Diagnóstico/presupuesto/estado | Edición de orden por técnico/admin | Implementado |
| Historial | Tabla y endpoint | Implementado |
| Asignación de técnico | API admite `technician_id` | Parcial: falta pantalla dedicada |
| Estadísticas admin | Endpoint de resumen | API implementada; falta gráfico en móvil |
| Validación y seguridad | bcrypt, consultas parametrizadas, roles, Helmet, rate limit | Base implementada; requiere auditoría antes de producción |
| Documentación | README, instalación, manual, API, pruebas, demo | Incluida |
