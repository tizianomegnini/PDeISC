import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Inicio from './pages/Inicio'
import DetalleTarea from './pages/DetalleTarea'
import CrearTarea from './pages/CrearTarea'

import tareasIniciales from './data/tareas'

import './App.css'

function App() {

  const [tareas, setTareas] = useState(() => {
    const tareasGuardadas = localStorage.getItem('tareas')

    return tareasGuardadas
      ? JSON.parse(tareasGuardadas)
      : tareasIniciales
  })

  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem('modoOscuro') === 'true'
  })

  // Tarea que se está intentando eliminar
  const [tareaAEliminar, setTareaAEliminar] = useState(null)

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas))
  }, [tareas])

  useEffect(() => {
    localStorage.setItem('modoOscuro', modoOscuro)

    document.body.className = modoOscuro
      ? 'modo-oscuro'
      : 'modo-claro'
  }, [modoOscuro])

  const agregarTarea = (nuevaTarea) => {
    setTareas((tareasActuales) => [
      ...tareasActuales,
      nuevaTarea
    ])
  }

  // Solamente abre la ventana de confirmación
  const solicitarEliminar = (id) => {
    const tarea = tareas.find(
      (tarea) => tarea.id === id
    )

    setTareaAEliminar(tarea)
  }

  // Elimina después de confirmar
  const confirmarEliminacion = () => {

    if (!tareaAEliminar) {
      return
    }

    setTareas((tareasActuales) =>
      tareasActuales.filter(
        (tarea) => tarea.id !== tareaAEliminar.id
      )
    )

    setTareaAEliminar(null)
  }

  // Cancela la eliminación
  const cancelarEliminacion = () => {
    setTareaAEliminar(null)
  }

  const descargarTareas = () => {

    const contenido = JSON.stringify(tareas, null, 2)

    const archivo = new Blob(
      [contenido],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(archivo)

    const enlace = document.createElement('a')

    enlace.href = url
    enlace.download = 'tareas.json'

    enlace.click()

    URL.revokeObjectURL(url)
  }

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Inicio
              tareas={tareas}
              solicitarEliminar={solicitarEliminar}
              descargarTareas={descargarTareas}
              modoOscuro={modoOscuro}
              setModoOscuro={setModoOscuro}
            />
          }
        />

        <Route
          path="/tarea/:id"
          element={
            <DetalleTarea
              tareas={tareas}
              solicitarEliminar={solicitarEliminar}
              modoOscuro={modoOscuro}
            />
          }
        />

        <Route
          path="/crear"
          element={
            <CrearTarea
              agregarTarea={agregarTarea}
              modoOscuro={modoOscuro}
            />
          }
        />

      </Routes>


      {/* VENTANA DE CONFIRMACIÓN */}

      {tareaAEliminar && (

        <div
          className="modal-backdrop-custom"
          onClick={cancelarEliminacion}
        >

          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="delete-modal-icon">
              🗑️
            </div>

            <h3 className="fw-bold">
              ¿Eliminar tarea?
            </h3>

            <p className="text-secondary">
              Vas a eliminar la tarea:
            </p>

            <div className="delete-task-name">
              {tareaAEliminar.titulo}
            </div>

            <p className="text-secondary small">
              Esta acción no se puede deshacer.
            </p>

            <div className="d-flex justify-content-end gap-2 mt-4">

              <button
                className="btn btn-outline-secondary"
                onClick={cancelarEliminacion}
              >
                Cancelar
              </button>

              <button
                className="btn btn-danger"
                onClick={confirmarEliminacion}
              >
                Eliminar
              </button>

            </div>

          </div>

        </div>

      )}

    </BrowserRouter>
  )
}

export default App