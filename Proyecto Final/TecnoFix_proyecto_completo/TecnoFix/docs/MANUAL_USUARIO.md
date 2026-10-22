# Manual de usuario — TecnoFix

## Cliente
1. Registrate con nombre, email y contraseña de al menos 8 caracteres.
2. Iniciá sesión.
3. Registrá el dispositivo indicando tipo, marca y modelo.
4. Creá una solicitud y describí la falla.
5. Abrí la orden para consultar estado, diagnóstico, presupuesto e historial.

## Técnico
1. Iniciá sesión con una cuenta cuyo rol sea `tecnico`.
2. La pantalla muestra las órdenes asignadas a tu cuenta.
3. Abrí una orden para cargar diagnóstico, presupuesto, notas y nuevo estado.
4. Guardá los cambios para agregar un registro al historial.

## Administración
1. Iniciá sesión con rol `admin`.
2. La pantalla muestra todas las órdenes.
3. Usá “Crear usuario / técnico” para crear cuentas.
4. La asignación de técnicos se realiza por API `PATCH /api/repairs/:id` enviando `technician_id`, además de los campos a actualizar. Una pantalla de asignación visual puede añadirse como mejora.

## Estados
- Solicitud recibida
- Pendiente de diagnóstico
- En diagnóstico
- Presupuestada
- En reparación
- Esperando repuestos
- Lista para entregar
- Entregada
- Cancelada

## Seguridad
Cada cliente solo puede consultar sus dispositivos y reparaciones. El técnico solo consulta las órdenes asignadas. Administración puede consultar todas las órdenes y gestionar usuarios.
