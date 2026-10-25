import { useEffect, useRef, useState } from 'react';
import { consultasApi } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fecha, nombreCompleto } from '../utils.js';

/** Mensajes de una consulta. Se actualiza solo cada 8 segundos (sondeo simple, sin websockets). */
export default function Chat({ consultaId, cerrada, onSent }) {
  const { user } = useAuth();
  const toast = useToast();
  const [mensajes, setMensajes] = useState(null);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const fin = useRef(null);

  const cargar = () => consultasApi.mensajes(consultaId).then((r) => setMensajes(r.mensajes)).catch(() => {});
  useEffect(() => { cargar(); const t = setInterval(cargar, 8000); return () => clearInterval(t); }, [consultaId]); // eslint-disable-line
  useEffect(() => { fin.current?.scrollIntoView({ block: 'nearest' }); }, [mensajes?.length]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    try { await consultasApi.enviarMensaje(consultaId, texto); setTexto(''); await cargar(); onSent?.(); }
    catch (err) { toast.error(err.message); }
    finally { setEnviando(false); }
  };

  return (
    <section className="card">
      <h3>Mensajes</h3>
      <div className="chat">
        {mensajes === null && <p className="loading">Cargando mensajes…</p>}
        {mensajes?.length === 0 && <p className="muted">Todavía no hay mensajes.</p>}
        {mensajes?.map((m) => (
          <div key={m.id} className={`msg ${m.autor_id === user.id ? 'mine' : ''}`}>
            <small>{nombreCompleto(m.autor_nombre, m.autor_apellido)} · {m.autor_rol} · {fecha(m.created_at)}</small>
            <p>{m.contenido}</p>
          </div>
        ))}
        <div ref={fin} />
      </div>
      {user.rol !== 'admin' && (cerrada ? <p className="muted">La consulta está cerrada: no admite más mensajes.</p> : (
        <form onSubmit={enviar} className="row">
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escriba un mensaje" maxLength={2000} aria-label="Mensaje" />
          <button disabled={enviando || !texto.trim()}>{enviando ? 'Enviando…' : 'Enviar'}</button>
        </form>
      ))}
    </section>
  );
}
