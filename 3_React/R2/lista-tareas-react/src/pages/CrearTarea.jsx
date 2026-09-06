import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function CrearTarea({ agregarTarea, modoOscuro }) {

  const navigate = useNavigate()

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [completa, setCompleta] = useState(false)

  const manejarEnvio = (e) => {

    e.preventDefault()

    if (
      titulo.trim() === '' ||
      descripcion.trim() === ''
    ) {
      return
    }

    const nuevaTarea = {

      id: Date.now(),

      titulo: titulo.trim(),

      descripcion: descripcion.trim(),

      fecha: new Date().toLocaleDateString('es-AR'),

      completa: completa

    }

    agregarTarea(nuevaTarea)

    navigate('/')
  }

  return (
    <div className="container-fluid px-3 px-md-5 py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <Link
          to="/"
          className="btn btn-outline-secondary"
        >
          ← Volver
        </Link>

      </div>


      <div className="create-page">

        <div className="create-header">

          <div>

            <h1 className="fw-bold mb-2">
              ➕ Nueva tarea
            </h1>

            <p className="text-secondary mb-0">
              Completá los datos para crear una nueva tarea.
            </p>

          </div>

        </div>


        <form
          onSubmit={manejarEnvio}
          className="create-form"
        >

          <div className="row g-4">

            <div className="col-12 col-lg-6">

              <label
                htmlFor="titulo"
                className="form-label fw-semibold"
              >
                Título
              </label>

              <input
                type="text"
                id="titulo"
                className="form-control form-control-lg"
                placeholder="Ej: Estudiar para matemática"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />

            </div>


            <div className="col-12 col-lg-6">

              <label
                htmlFor="fecha"
                className="form-label fw-semibold"
              >
                Fecha de creación
              </label>

              <input
                type="text"
                id="fecha"
                className="form-control form-control-lg"
                value={new Date().toLocaleDateString('es-AR')}
                disabled
              />

            </div>


            <div className="col-12">

              <label
                htmlFor="descripcion"
                className="form-label fw-semibold"
              >
                Descripción
              </label>

              <textarea
                id="descripcion"
                className="form-control description-input"
                rows="12"
                placeholder="Escribí una descripción detallada de la tarea..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />

            </div>


            <div className="col-12">

              <div className="form-check form-switch">

                <input
                  type="checkbox"
                  id="completa"
                  className="form-check-input"
                  checked={completa}
                  onChange={(e) =>
                    setCompleta(e.target.checked)
                  }
                />

                <label
                  htmlFor="completa"
                  className="form-check-label"
                >
                  Marcar tarea como completa
                </label>

              </div>

            </div>


            <div className="col-12">

              <hr />

              <div className="d-flex justify-content-end gap-2 flex-wrap">

                <Link
                  to="/"
                  className="btn btn-outline-secondary btn-lg"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-5"
                >
                  Crear tarea
                </button>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  )
}

export default CrearTarea