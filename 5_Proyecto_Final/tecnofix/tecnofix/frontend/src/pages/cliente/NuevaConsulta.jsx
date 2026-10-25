import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultasApi } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const TIPOS = ['Celular', 'Notebook', 'PC de escritorio', 'Tablet', 'Consola', 'Impresora', 'Otro'];

export default function NuevaConsulta() {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ tipo_equipo: TIPOS[0], marca: '', modelo: '', descripcion: '' });
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
        <label>Tipo de equipo<select value={form.tipo_equipo} onChange={set('tipo_equipo')}>{TIPOS.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label>Marca<input value={form.marca} onChange={set('marca')} required maxLength={60} /></label>
        <label>Modelo<input value={form.modelo} onChange={set('modelo')} required maxLength={80} /></label>
        <label>Descripción del problema (mínimo 10 caracteres)<textarea value={form.descripcion} onChange={set('descripcion')} required minLength={10} maxLength={2000} /></label>
        {error && <div className="alert error" role="alert">{error}</div>}
        <button disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar consulta'}</button>
      </form>
    </div>
  );
}
