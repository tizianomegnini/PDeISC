import { useRef, useState } from "react";
import { exportData, importData, resetData } from "../../lib/apiClient";
import { useEditMode } from "../../context/EditModeContext";
import "../../styles/editors.css";

/**
 * DataEditor
 * ----------
 * Panel para llevarse / traerse el contenido del portfolio. Los cambios que
 * se hacen desde el sitio se guardan solo en este navegador; para publicarlos
 * hay que exportarlos y reemplazar src/data/seed.json (ver README).
 */
export default function DataEditor() {
  const { notifyChanged } = useEditMode();
  const fileRef = useRef(null);
  const [status, setStatus] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  function handleExport() {
    const json = JSON.stringify(exportData(), null, 2) + "\n";
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "seed.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Listo: se descargó seed.json. Reemplazá src/data/seed.json con ese archivo y subilo a GitHub.");
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      importData(JSON.parse(await file.text()));
      notifyChanged();
      setStatus("Contenido importado.");
    } catch (err) {
      setStatus("No se pudo importar: " + err.message);
    }
  }

  function handleReset() {
    resetData();
    notifyChanged();
    setConfirmReset(false);
    setStatus("Se descartaron los cambios de este navegador. Se muestra el contenido de seed.json.");
  }

  return (
    <div className="editor">
      {status && <p className="editor__status">{status}</p>}

      <div className="editor__row">
        <p>
          El contenido que editás se guarda <strong>solo en este navegador</strong>. Para que lo vean todos los
          visitantes, exportalo y reemplazá <code>src/data/seed.json</code> en el proyecto; al hacer push, Vercel
          vuelve a desplegar.
        </p>
        <div className="editor__actions">
          <button type="button" className="btn btn--primary" onClick={handleExport}>
            Exportar contenido
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            Importar archivo…
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleImport} />
        </div>
      </div>

      <div className="editor__row">
        <h4 className="editor__subtitle">Descartar cambios</h4>
        <p>Vuelve al contenido original de seed.json y borra lo editado en este navegador.</p>
        <div className="editor__actions">
          {confirmReset ? (
            <>
              <button type="button" className="btn" onClick={() => setConfirmReset(false)}>
                Cancelar
              </button>
              <button type="button" className="btn editor__danger" onClick={handleReset}>
                Sí, restablecer
              </button>
            </>
          ) : (
            <button type="button" className="btn editor__danger" onClick={() => setConfirmReset(true)}>
              Restablecer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
