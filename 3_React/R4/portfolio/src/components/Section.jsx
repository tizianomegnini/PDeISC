import { useReveal } from "../hooks/useReveal";

/**
 * Section
 * -------
 * Envoltorio reutilizado por cada bloque del portfolio (About, Skills,
 * Achievements, Experience, Projects, Contact). Aplica el hook useReveal
 * para animar la entrada cuando la sección se vuelve visible, y dibuja
 * un encabezado consistente con título + índice opcional.
 *
 * @param {string} id - id usado por el Navbar para hacer scroll y resaltar el link.
 * @param {string} title - título visible de la sección.
 * @param {string} [index] - etiqueta corta ("01", "02"...) opcional.
 */
export default function Section({ id, title, index, children }) {
  const [ref, isVisible] = useReveal({ threshold: 0.12 });

  return (
    <section id={id} className="section">
      <div
        ref={ref}
        className={`container reveal ${isVisible ? "is-visible" : ""}`}
      >
        <div className="section__head">
          <h2 className="section__title">{title}</h2>
          {index && <span className="section__index">{index}</span>}
        </div>
        {children}
      </div>
    </section>
  );
}
