// Importamos Link para navegar entre las diferentes páginas
// y useParams para obtener parámetros de la URL.
import { Link, useParams } from 'react-router-dom'


// Componente que muestra toda la información de una tarea específica.
// Recibe la lista de tareas, la función para solicitar una eliminación
// y el estado del modo oscuro.
function DetalleTarea({
  tareas,
  solicitarEliminar,
  modoOscuro
}) {

  // Obtenemos el parámetro "id" de la URL.
  // Por ejemplo, si la URL es /tarea/123, id tendrá el valor "123".
  const { id } = useParams()


  // Buscamos dentro del array de tareas la que tenga
  // el mismo ID que recibimos desde la URL.
  // Number(id) convierte el parámetro de texto a número
  // para poder compararlo correctamente.
  const tarea = tareas.find(
    (tarea) => tarea.id === Number(id)
  )


  // Si no encontramos ninguna tarea con ese ID,
  // mostramos un mensaje indicando que no existe.
  if (!tarea) {

    return (
      <div className="container-fluid px-3 px-md-5 py-5">

        <div className="empty-state">

          {/* Icono utilizado para indicar que no se encontró la tarea */}
          <div className="empty-icon">
            🔍
          </div>

          <h3>Tarea no encontrada</h3>

          <p className="text-secondary">
            La tarea que buscás no existe.
          </p>

          {/* Link para regresar a la página principal */}
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


  // Si la tarea existe, mostramos toda su información.
  return (
    <div className="container-fluid px-3 px-md-5 py-4">


      {/* Barra superior con el botón para volver
          y el botón para eliminar la tarea */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">


        {/* Regresa a la página principal */}
        <Link
          to="/"
          className="btn btn-outline-secondary"
        >
          ← Volver
        </Link>


        {/* Solicita la eliminación de la tarea.
            Se envía el ID de la tarea a la función correspondiente. */}
        <button
          onClick={() => solicitarEliminar(tarea.id)}
          className="btn btn-outline-danger"
        >
          🗑️ Eliminar tarea
        </button>

      </div>


      {/* Tarjeta principal donde se muestra la información */}
      <div className="detail-card">


        {/* Encabezado de la tarjeta */}
        <div className="detail-header">

          <div>

            {/* Texto que indica que estamos viendo el detalle */}
            <span className="text-secondary">
              Detalle de la tarea
            </span>


            {/* Mostramos el título de la tarea */}
            <h1 className="fw-bold detail-title">
              {tarea.titulo}
            </h1>

          </div>


          {/* Indicador visual del estado de la tarea.
              La clase cambia dependiendo de si está completa o no. */}
          <span
            className={`badge fs-6 ${
              tarea.completa
                ? 'text-bg-success'
                : 'text-bg-warning'
            }`}
          >

            {/* También cambiamos el texto según el estado */}
            {tarea.completa
              ? '✓ Completa'
              : '⏳ Incompleta'}

          </span>

        </div>


        {/* Línea separadora entre el encabezado y el contenido */}
        <hr />


        {/* Contenido principal de la información */}
        <div className="detail-content">


          {/* Sección que muestra la descripción */}
          <div className="detail-section">

            <h5>
              Descripción
            </h5>


            {/* Mostramos la descripción guardada en la tarea */}
            <div className="description-box">
              {tarea.descripcion}
            </div>

          </div>


          {/* Información adicional de la tarea */}
          <div className="detail-info">


            {/* Fecha en la que se creó la tarea */}
            <div>

              <h6>
                📅 Fecha de creación
              </h6>

              <p>
                {tarea.fecha}
              </p>

            </div>


            {/* Estado actual de la tarea */}
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