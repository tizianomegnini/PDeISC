import { useState } from "react";

// Componente que contiene un formulario simple.
function Formulario() {
  // Estado utilizado para guardar el nombre ingresado.
  const [nombre, setNombre] = useState("");

  // Estado utilizado para controlar si se envió el formulario.
  const [enviado, setEnviado] = useState(false);

  // Maneja el envío del formulario.
  const manejarEnvio = (evento) => {
    evento.preventDefault();

    if (nombre.trim() === "") {
      return;
    }

    setEnviado(true);
  };

  return (
    <section className="actividad">
      <div className="actividad-header">
        <span className="numero">05</span>

        <div>
          <p className="etiqueta">Actividad 5</p>
          <h2>Formulario simple</h2>
        </div>
      </div>

      <form
        className="formulario"
        onSubmit={manejarEnvio}
      >
        <label htmlFor="nombre">
          Nombre
        </label>

        <input
          id="nombre"
          type="text"
          placeholder="Ingresá tu nombre"
          value={nombre}
          onChange={(evento) => {
            setNombre(evento.target.value);
            setEnviado(false);
          }}
        />

        <button
          type="submit"
          className="boton principal"
        >
          Enviar
        </button>
      </form>

      {enviado && (
        <div className="mensaje-bienvenida">
          <span>✓</span>

          <p>
            ¡Bienvenido/a, <strong>{nombre}</strong>!
          </p>
        </div>
      )}
    </section>
  );
}

export default Formulario;