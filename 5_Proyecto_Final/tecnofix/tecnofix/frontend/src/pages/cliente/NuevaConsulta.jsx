import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultasApi } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const TIPOS = ['Celular', 'Notebook', 'PC de escritorio', 'Tablet', 'Consola', 'Impresora', 'Otro'];

export default function NuevaConsulta() {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ tipo_equipo: '', marca: '', modelo: '', descripcion: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault(); setError(''); setEnviando(true);
    try {
      const { consulta } = await consultasApi.create(form);
      toast.ok(consulta.estado === 'asignada' ? 'Consulta creada y asignada a un técnico' : 'Consulta creada: quedó pendiente hasta que haya un técnico disponible');
      navigate(`/consultas/${consulta.id}`);
    } catch (err) { setError(err.message); } finally { setEnviando(false); }
  };
  return (
    <div className="card" style={{ maxWidth: 620 }}>
      <h1>Nueva consulta de soporte</h1>
      <form onSubmit={enviar} className="stack">
        <p className="muted">¿No conocés el tipo, la marca o el modelo? Podés dejar esos datos vacíos. Cuando un técnico tome la consulta, vas a poder hablar con él desde el detalle.</p>
        <label>Tipo de equipo (opcional)<select value={form.tipo_equipo} onChange={set('tipo_equipo')}><option value="">No sé qué equipo tengo</option>{TIPOS.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label>Marca (opcional)<input value={form.marca} onChange={set('marca')} maxLength={60} /></label>
        <label>Modelo (opcional)<input value={form.modelo} onChange={set('modelo')} maxLength={80} /></label>
        <label>Descripción del problema (mínimo 10 caracteres)<textarea value={form.descripcion} onChange={set('descripcion')} required minLength={10} maxLength={2000} /></label>
        {error && <div className="alert error" role="alert">{error}</div>}
        <button disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar consulta'}</button>
      </form>
    </div>
  );
}
