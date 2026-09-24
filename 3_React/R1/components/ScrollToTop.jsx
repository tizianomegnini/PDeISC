import { useEffect, useState } from "react";

// Componente que muestra un botón para volver al comienzo de la página.
function ScrollToTop() {
  // Determina si el botón debe mostrarse.
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    // Detecta la posición vertical de la página.
    const controlarScroll = () => {
      setMostrar(window.scrollY > 400);
    };

    window.addEventListener("scroll", controlarScroll);

    // Limpia el evento cuando se desmonta el componente.
    return () => {
      window.removeEventListener("scroll", controlarScroll);
    };
  }, []);

  // Lleva suavemente la página hasta arriba.
  const volverArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!mostrar) {
    return null;
  }

  return (
    <button
      className="scroll-top"
      onClick={volverArriba}
      aria-label="Volver arriba"
    >
      ↑
    </button>
  );
}

export default ScrollToTop;