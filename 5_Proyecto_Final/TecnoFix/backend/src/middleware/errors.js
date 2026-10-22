export function notFound(req, res) {
  res.status(404).json({ error: 'Ruta no encontrada.' });
}
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  const status = Number(err.status || 500);
  res.status(status).json({ error: status >= 500 ? 'Error interno del servidor.' : err.message });
}
