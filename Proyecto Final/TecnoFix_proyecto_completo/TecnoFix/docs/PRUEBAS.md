# Plan de pruebas

## Pruebas manuales recomendadas
1. Arrancar MySQL, importar esquema y seed; confirmar que no hay errores SQL.
2. Arrancar backend y abrir `/api/health`.
3. Registrar un cliente nuevo; confirmar que queda en `users` con rol `cliente`.
4. Intentar registrar el mismo email: debe devolver HTTP 409.
5. Iniciar sesión con contraseña incorrecta: debe devolver HTTP 401.
6. Iniciar sesión con cada rol y verificar que el listado de órdenes respete los permisos.
7. Como cliente, crear dispositivo y orden.
8. Como técnico asignado, actualizar diagnóstico/estado; como técnico no asignado, debe fallar.
9. Como cliente, intentar abrir la historia de otra persona; debe devolver HTTP 403.
10. Renovar refresh token y confirmar que el anterior queda revocado.
11. Probar QR de Expo Go en una red local real.
12. Ejecutar build EAS Android y probar el APK en un dispositivo.

## Resultado del entorno de generación
No se ejecutaron pruebas de integración contra MySQL, un teléfono Android ni EAS Build durante la creación de este ZIP. No se deben interpretar los pasos anteriores como resultados ya aprobados.
