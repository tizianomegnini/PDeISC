import { useCallback, useEffect, useRef, useState } from 'react';
import { consultasApi } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fecha, nombreCompleto } from '../utils.js';

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain'];
const formatSize = (bytes) => bytes < 1024 * 1024
  ? `${Math.max(1, Math.round(bytes / 1024))} KB`
  : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/** Mensajes de una consulta. Se actualiza solo cada 8 segundos (sondeo simple, sin websockets). */
export default function Chat({ consultaId, cerrada, onSent }) {
  const { user } = useAuth();
  const toast = useToast();
  const [mensajes, setMensajes] = useState(null);
  const [texto, setTexto] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [recursos, setRecursos] = useState({});
  const [enviando, setEnviando] = useState(false);
  const fin = useRef(null);
  const selectorArchivos = useRef(null);
  const urlsAdjuntos = useRef(new Map());
  const cargasAdjuntos = useRef(new Map());
  const recursosRef = useRef(recursos);
  const montado = useRef(false);
  const consultaIdRef = useRef(consultaId);
  recursosRef.current = recursos;
  consultaIdRef.current = consultaId;

  const cargar = () => consultasApi.mensajes(consultaId).then((r) => setMensajes(r.mensajes)).catch(() => {});
  useEffect(() => { cargar(); const t = setInterval(cargar, 8000); return () => clearInterval(t); }, [consultaId]); // eslint-disable-line
  useEffect(() => { fin.current?.scrollIntoView({ block: 'nearest' }); }, [mensajes?.length, recursos]);
  const actualizarRecurso = useCallback((adjuntoId, recurso) => {
    const actualizados = { ...recursosRef.current, [adjuntoId]: recurso };
    recursosRef.current = actualizados;
    setRecursos(actualizados);
  }, []);
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
      for (const url of urlsAdjuntos.current.values()) URL.revokeObjectURL(url);
      urlsAdjuntos.current.clear();
    };
  }, []);
  useEffect(() => {
    for (const mensaje of mensajes || []) {
      for (const adjunto of mensaje.adjuntos || []) {
        if (!adjunto.disponible) {
          const url = urlsAdjuntos.current.get(adjunto.id);
          if (url) URL.revokeObjectURL(url);
          urlsAdjuntos.current.delete(adjunto.id);
          if (recursosRef.current[adjunto.id]?.estado !== 'vencido') {
            actualizarRecurso(adjunto.id, { estado: 'vencido' });
          }
          continue;
        }
        if (recursosRef.current[adjunto.id] || urlsAdjuntos.current.has(adjunto.id) || cargasAdjuntos.current.has(adjunto.id)) continue;
        actualizarRecurso(adjunto.id, { estado: 'cargando' });
        const carga = consultasApi.descargarAdjunto(consultaId, adjunto.id)
          .then((blob) => {
            if (!montado.current || consultaIdRef.current !== consultaId) return;
            const url = URL.createObjectURL(blob);
            urlsAdjuntos.current.set(adjunto.id, url);
            actualizarRecurso(adjunto.id, { estado: 'listo', url });
          })
          .catch((error) => {
            if (montado.current && consultaIdRef.current === consultaId) {
              actualizarRecurso(adjunto.id, { estado: error.status === 410 ? 'vencido' : 'error' });
            }
          })
          .finally(() => cargasAdjuntos.current.delete(adjunto.id));
        cargasAdjuntos.current.set(adjunto.id, carga);
      }
    }
  }, [mensajes, consultaId, actualizarRecurso]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() && archivos.length === 0) return;
    setEnviando(true);
    try {
      if (archivos.length) await consultasApi.enviarAdjuntos(consultaId, archivos, texto);
      else await consultasApi.enviarMensaje(consultaId, texto);
      setTexto('');
      setArchivos([]);
      if (selectorArchivos.current) selectorArchivos.current.value = '';
      await cargar();
      onSent?.();
    }
    catch (err) { toast.error(err.message); }
    finally { setEnviando(false); }
  };
  const seleccionarArchivos = (e) => {
    const seleccionados = Array.from(e.target.files || []);
    e.target.value = '';
    if (archivos.length + seleccionados.length > MAX_FILES) {
      toast.error(`Podés adjuntar hasta ${MAX_FILES} archivos por mensaje.`);
      return;
    }
    const invalido = seleccionados.find((file) => !ACCEPTED_TYPES.includes(file.type) || file.size > MAX_FILE_BYTES);
    if (invalido) {
      toast.error(invalido.size > MAX_FILE_BYTES
        ? `${invalido.name} supera el máximo de 5 MB.`
        : 'Solo se permiten imágenes JPG, PNG o WEBP, documentos PDF y archivos TXT.');
      return;
    }
    setArchivos((actuales) => [...actuales, ...seleccionados]);
  };
  const quitarArchivo = (indice) => setArchivos((actuales) => actuales.filter((_, i) => i !== indice));

  return (
    <section className="card chat-panel">
      <header className="chat-heading">
        <div>
          <span className="eyebrow">CONVERSACIÓN</span>
          <h3>Mensajes de la consulta</h3>
          <p>Escribí como en un chat. Si podés, contá qué estabas haciendo cuando apareció el problema. Los mensajes se actualizan automáticamente cada unos segundos.</p>
        </div>
        <span className="chat-live" aria-label="Mensajes actualizados automáticamente"><span /> Actualización automática</span>
      </header>
      <div className="chat">
        {mensajes === null && <p className="loading">Cargando mensajes…</p>}
        {mensajes?.length === 0 && <div className="chat-empty"><span aria-hidden="true">✉</span><strong>La conversación empieza acá</strong><p>Mandale un mensaje al técnico si querés agregar detalles o hacer una pregunta.</p></div>}
        {mensajes?.map((m) => (
          <div key={m.id} className={`msg ${m.autor_id === user.id ? 'mine' : ''}`}>
            <small>{nombreCompleto(m.autor_nombre, m.autor_apellido)} · {fecha(m.created_at)}</small>
            {!m.adjuntos?.length && <p>{m.contenido}</p>}
            {(m.adjuntos || []).map((adjunto) => {
              const recurso = recursos[adjunto.id];
              return (
                <div className="message-attachment" key={adjunto.id}>
                  {recurso?.estado === 'listo' && adjunto.categoria === 'foto'
                    ? <a href={recurso.url} target="_blank" rel="noreferrer"><img src={recurso.url} alt={`Foto enviada: ${adjunto.nombre}`} /></a>
                    : recurso?.estado === 'listo'
                      ? <a className="file-download" href={recurso.url} download={adjunto.nombre}><span aria-hidden="true">▤</span><span><strong>{adjunto.nombre}</strong><small>{formatSize(adjunto.tamanio)} · Descargar archivo</small></span></a>
                      : <span className={`file-status ${recurso?.estado === 'vencido' ? 'expired' : ''}`}>
                        <span aria-hidden="true">{adjunto.categoria === 'foto' ? '▧' : '▤'}</span>
                        <span><strong>{adjunto.categoria === 'foto' ? 'Foto enviada' : adjunto.nombre}</strong><small>{recurso?.estado === 'cargando' ? 'Cargando…' : recurso?.estado === 'error' ? 'No se pudo abrir. Revisá tu conexión.' : `El archivo ya no está disponible. Se conserva el aviso. (${formatSize(adjunto.tamanio)})`}</small></span>
                      </span>}
                </div>
              );
            })}
          </div>
        ))}
        <div ref={fin} />
      </div>
      {user.rol !== 'admin' && (cerrada ? <p className="chat-closed">Esta consulta ya terminó y la conversación está cerrada.</p> : (
        <>
          <p className="attachment-help">Podés enviar hasta 5 archivos por mensaje: fotos JPG, PNG o WEBP, PDF o TXT (máximo 5 MB cada uno). Por privacidad, se conservan hasta que se reinicie el servidor; el aviso del mensaje queda en el chat.</p>
          {archivos.length > 0 && <div className="selected-files">{archivos.map((file, indice) => (
            <div className="selected-file" key={`${file.name}-${file.lastModified}-${indice}`}>
              <span aria-hidden="true">{file.type.startsWith('image/') ? '▧' : '▤'}</span>
              <span><strong>{file.name}</strong><small>{formatSize(file.size)}</small></span>
              <button type="button" className="remove-file" onClick={() => quitarArchivo(indice)} aria-label={`Quitar ${file.name}`}>×</button>
            </div>
          ))}</div>}
          <form onSubmit={enviar} className="chat-composer">
            <input ref={selectorArchivos} className="visually-hidden" id={`adjuntos-${consultaId}`} type="file" multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,image/jpeg,image/png,image/webp,application/pdf,text/plain"
              onChange={seleccionarArchivos} />
            <button type="button" className="chat-attach" onClick={() => selectorArchivos.current?.click()} disabled={enviando || archivos.length >= MAX_FILES} aria-label="Adjuntar fotos o archivos" title="Adjuntar fotos o archivos">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 11.1 12 20.5a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" /></svg>
            </button>
            <label className="visually-hidden" htmlFor={`mensaje-${consultaId}`}>Escribe un mensaje para el técnico</label>
            <input id={`mensaje-${consultaId}`} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribí tu mensaje…" maxLength={2000} />
            <button className="chat-send" disabled={enviando || (!texto.trim() && archivos.length === 0)} aria-label={enviando ? 'Enviando mensaje' : 'Enviar mensaje'}>
              {enviando ? '…' : <><span aria-hidden="true">➤</span><span className="chat-send-label">Enviar</span></>}
            </button>
          </form>
        </>
      ))}
    </section>
  );
}
