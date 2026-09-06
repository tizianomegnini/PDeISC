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

  const eliminarTarea = (id) => {

    const confirmar = window.confirm(
      '¿Estás seguro de que querés eliminar esta tarea?'
    )

    if (!confirmar) {
      return
    }

    setTareas((tareasActuales) =>
      tareasActuales.filter((tarea) => tarea.id !== id)
    )
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
              eliminarTarea={eliminarTarea}
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
              eliminarTarea={eliminarTarea}
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

    </BrowserRouter>
  )
}

export default App