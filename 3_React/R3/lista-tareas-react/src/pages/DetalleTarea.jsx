import { Link, useParams } from 'react-router-dom'

function DetalleTarea({
  tareas,
  solicitarEliminar,
  modoOscuro
}) {

  const { id } = useParams()

  const tarea = tareas.find(
    (tarea) => tarea.id === Number(id)
  )

  if (!tarea) {

    return (
      <div className="container-fluid px-3 px-md-5 py-5">

        <div className="empty-state">

          <div className="empty-icon">
            🔍
          </div>

          <h3>Tarea no encontrada</h3>

          <p className="text-secondary">
            La tarea que buscás no existe.
          </p>

          <Link
            to="/"
            className="btn btn-primary"
          >
            Volver al inicio
          </Link>

        </div>

      </div>
    )
  }

  return (
    <div className="container-fluid px-3 px-md-5 py-4">

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

        <Link
          to="/"
          className="btn btn-outline-secondary"
        >
          ← Volver
        </Link>

        <button
          onClick={() => solicitarEliminar(tarea.id)}
          className="btn btn-outline-danger"
        >
          🗑️ Eliminar tarea
        </button>

      </div>

      <div className="detail-card">

        <div className="detail-header">

          <div>

            <span className="text-secondary">
              Detalle de la tarea
            </span>

            <h1 className="fw-bold detail-title">
              {tarea.titulo}
            </h1>

          </div>

          <span
            className={`badge fs-6 ${
              tarea.completa
                ? 'text-bg-success'
                : 'text-bg-warning'
            }`}
          >
            {tarea.completa
              ? '✓ Completa'
              : '⏳ Incompleta'}
          </span>

        </div>

        <hr />

        <div className="detail-content">

          <div className="detail-section">

            <h5>
              Descripción
            </h5>

            <div className="description-box">
              {tarea.descripcion}
            </div>

          </div>

          <div className="detail-info">

            <div>
              <h6>
                📅 Fecha de creación
              </h6>

              <p>
                {tarea.fecha}
              </p>
            </div>

            <div>
              <h6>
                📌 Estado
              </h6>

              <p>
                {tarea.completa
                  ? 'La tarea está completa.'
                  : 'La tarea está pendiente.'}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default DetalleTarea