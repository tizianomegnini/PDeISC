import HolaMundo from "./components/HolaMundo";
import TarjetaPresentacion from "./components/TarjetaPresentacion";
import Contador from "./components/Contador";
import ListaTareas from "./components/ListaTareas";
import Formulario from "./components/Formulario";
import ThemeToggle from "./components/ThemeToggle";
import ScrollToTop from "./components/ScrollToTop";

// Componente principal de la aplicación.
function App() {
  return (
    <>
      <header className="header">
        <div className="header-contenido">
          <a href="#" className="logo">
            React<span>.</span>
          </a>

          <ThemeToggle />
        </div>
      </header>

      <main>
        {/* Presentación principal */}
        <section className="hero">
          <div className="hero-contenido">
            <span className="hero-tag">
              TRABAJO PRÁCTICO · REACT
            </span>

            <h1>
              Primeros pasos
              <br />
              con <span>React</span>
            </h1>

            <p>
              Cinco actividades para practicar componentes,
              props, estados, formularios y listas dinámicas.
            </p>

            <a href="#actividades" className="boton principal">
              Ver actividades ↓
            </a>
          </div>
        </section>

        {/* Contenedor de todas las actividades */}
        <div id="actividades" className="contenedor">
          <HolaMundo />

          <TarjetaPresentacion
            nombre="Tiziano"
            apellido="Riquelme"
            profesion="Técnico informático"
            imagen="https://i.pravatar.cc/500?img=12"
          />

          <Contador />

          <ListaTareas />

          <Formulario />
        </div>
      </main>

      <footer className="footer">
        <p>
          Trabajo práctico de React · 2026
        </p>

        <p>
          Componentes · Props · State
        </p>
      </footer>

      {/* Botón flotante para regresar al comienzo */}
      <ScrollToTop />
    </>
  );
}

export default App;