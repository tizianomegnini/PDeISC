import { useState } from "react";

// Componente para administrar una lista de tareas.
function ListaTareas() {
  // Array inicial de tareas.
  const [tareas, setTareas] = useState([
    {
      id: 1,
      texto: "Aprender React",
      completada: false
    },
    {
      id: 2,
      texto: "Practicar componentes",
      completada: true
    }
  ]);

  // Guarda el texto que escribe el usuario.
  const [nuevaTarea, setNuevaTarea] = useState("");

  // Agrega una nueva tarea al arreglo.
  const agregarTarea = (evento) => {
    evento.preventDefault();

    // Evita agregar tareas vacías.
    if (nuevaTarea.trim() === "") {
      return;
    }

    const tarea = {
      id: Date.now(),
      texto: nuevaTarea.trim(),
      completada: false
    };

    // Se agrega la nueva tarea manteniendo las anteriores.
    setTareas([...tareas, tarea]);

    // Limpia el input.
    setNuevaTarea("");
  };

  // Cambia el estado de una tarea entre completada y pendiente.
  const cambiarEstado = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id
          ? { ...tarea, completada: !tarea.completada }
          : tarea
      )
    );
  };

  // Elimina una tarea de la lista.
  const eliminarTarea = (id) => {
    setTareas(
      tareas.filter((tarea) => tarea.id !== id)
    );
  };

  return (
    <section className="actividad">
      <div className="actividad-header">
        <span className="numero">04</span>

        <div>
          <p className="etiqueta">Actividad 4</p>
          <h2>Lista de tareas</h2>
        </div>
      </div>

      <form
        className="formulario-tarea"
        onSubmit={agregarTarea}
      >
        <input
          type="text"
          placeholder="Escribí una nueva tarea..."
          value={nuevaTarea}
          onChange={(evento) =>
            setNuevaTarea(evento.target.value)
          }
        />

        <button type="submit" className="boton principal">
          Agregar
        </button>
      </form>

      <div className="tareas">
        {tareas.length === 0 ? (
          <p className="sin-tareas">
            No hay tareas cargadas.
          </p>
        ) : (
          tareas.map((tarea) => (
            <div
              className={`tarea ${
                tarea.completada ? "completada" : ""
              }`}
              key={tarea.id}
            >
              <button
                className="check"
                onClick={() => cambiarEstado(tarea.id)}
                type="button"
                aria-label="Cambiar estado de la tarea"
              >
                {tarea.completada ? "✓" : ""}
              </button>

              <span>{tarea.texto}</span>

              <button
                className="eliminar"
                onClick={() => eliminarTarea(tarea.id)}
                type="button"
                aria-label="Eliminar tarea"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default ListaTareas;