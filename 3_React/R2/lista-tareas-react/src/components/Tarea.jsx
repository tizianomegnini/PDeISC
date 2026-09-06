import { Link } from 'react-router-dom'

function Tarea({ tarea, eliminarTarea }) {

  return (
    <div className="card task-card h-100">

      <div className="card-body d-flex flex-column">

        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">

          <h5 className="card-title fw-bold task-title">
            {tarea.titulo}
          </h5>

          <span
            className={`badge flex-shrink-0 ${
              tarea.completa
                ? 'text-bg-success'
                : 'text-bg-warning'
            }`}
          >
            {tarea.completa
              ? 'Completa'
              : 'Pendiente'}
          </span>

        </div>


        <p className="card-text text-secondary task-description">
          {tarea.descripcion}
        </p>


        <small className="text-secondary mb-3">
          📅 {tarea.fecha}
        </small>


        <div className="mt-auto d-flex gap-2">

          <Link
            to={`/tarea/${tarea.id}`}
            className="btn btn-primary flex-grow-1"
          >
            Ver
          </Link>

          <button
            onClick={() => eliminarTarea(tarea.id)}
            className="btn btn-outline-danger"
            title="Eliminar tarea"
          >
            🗑️
          </button>

        </div>

      </div>

    </div>
  )
}

export default Tarea