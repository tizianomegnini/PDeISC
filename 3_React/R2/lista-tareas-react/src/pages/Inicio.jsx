// Importamos Link para poder navegar entre las diferentes páginas
// de la aplicación sin recargar el sitio.
import { Link } from 'react-router-dom'

// Importamos el componente Tarea, que se encarga de mostrar
// individualmente cada tarea de la lista.
import Tarea from '../components/Tarea'


// Componente principal de la página de inicio.
// Recibe las tareas y varias funciones/valores desde el componente padre.
function Inicio({
  tareas,
  solicitarEliminar,
  descargarTareas,
  modoOscuro,
  setModoOscuro
}) {

  return (
    <div className="container-fluid px-3 px-md-5 py-4">


      {/* Encabezado principal de la página */}
      <header className="main-header mb-5">

        <div>

          {/* Título de la aplicación */}
          <h1 className="fw-bold mb-1">
            📋 Lista de tareas
          </h1>


          {/* Texto descriptivo de la aplicación */}
          <p className="text-secondary mb-0">
            Organizá tus tareas de forma sencilla.
          </p>

        </div>


        {/* Contenedor de los botones del encabezado */}
        <div className="header-buttons">


          {/* Botón para cambiar entre modo claro y modo oscuro.
              El operador ! invierte el valor actual de modoOscuro. */}
          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            className="btn btn-outline-secondary"
          >

            {/* El texto cambia según el modo actual */}
            {modoOscuro
              ? '☀️ Modo claro'
              : '🌙 Modo oscuro'}

          </button>


          {/* Botón para descargar las tareas */}
          <button
            onClick={descargarTareas}
            className="btn btn-success"
          >
            ⬇️ Descargar
          </button>


          {/* Link que lleva al formulario para crear una nueva tarea */}
          <Link
            to="/crear"
            className="btn btn-primary"
          >
            + Nueva tarea
          </Link>

        </div>

      </header>


      {/* Sección que muestra el título "Mis tareas"
          y la cantidad total de tareas */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="h4 fw-bold mb-0">
          Mis tareas
        </h2>


        {/* Mostramos la cantidad de tareas.
            También cambiamos "tarea" por "tareas" según corresponda. */}
        <span className="badge text-bg-secondary fs-6">

          {tareas.length}{' '}

          {tareas.length === 1
            ? 'tarea'
            : 'tareas'}

        </span>

      </div>


      {/* Operador ternario utilizado para decidir qué mostrar:
          si no hay tareas, mostramos un mensaje;
          si existen tareas, mostramos las tarjetas. */}
      {tareas.length === 0 ? (

        /* Estado vacío: aparece cuando todavía no hay tareas */
        <div className="empty-state">

          <div className="empty-icon">
            📝
          </div>

          <h3>No hay tareas</h3>

          <p className="text-secondary">
            Todavía no agregaste ninguna tarea.
          </p>


          {/* Botón para ir directamente a crear la primera tarea */}
          <Link
            to="/crear"
            className="btn btn-primary"
          >
            Crear mi primera tarea
          </Link>

        </div>

      ) : (

        /* Si existen tareas, creamos una grilla para mostrarlas */
        <div className="row g-4">


          {/* map() recorre todas las tareas del array.
              Por cada tarea se genera un componente Tarea. */}
          {tareas.map((tarea) => (

            <div
              className="col-12 col-sm-6 col-lg-4 col-xl-3"

              // React utiliza key para identificar cada elemento
              // de forma única dentro de la lista.
              key={tarea.id}
            >


              {/* Componente encargado de mostrar una tarea individual.
                  Le pasamos la información de la tarea y la función
                  para solicitar su eliminación. */}
              <Tarea
                tarea={tarea}
                solicitarEliminar={solicitarEliminar}
              />

            </div>

          ))}

        </div>

      )}

    </div>
  )
}


// Exportamos el componente para poder utilizarlo
// desde el archivo principal de la aplicación.
export default Inicio
