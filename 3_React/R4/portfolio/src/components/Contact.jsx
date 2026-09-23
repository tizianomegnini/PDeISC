import { useState } from "react";
import Section from "./Section";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import "../styles/contact.css";

const EMPTY_FORM = { name: "", email: "", message: "" };

/**
 * Contact
 * -------
 * Formulario de contacto controlado por React (useState + eventos onChange/onSubmit).
 *
 * Si Supabase está configurado, el mensaje se guarda en la tabla "messages"
 * (ver supabase/schema.sql). Si no, el formulario simula el envío para que
 * la demo siga siendo funcional sin base de datos.
 */
export default function Contact({ email }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus({ state: "error", message: "Completá todos los campos." });
      return;
    }

    setStatus({ state: "sending", message: "Enviando…" });

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("messages").insert([form]);
        if (error) throw error;
      } else {
        // Sin base de datos configurada: simulamos una pequeña demora.
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setStatus({ state: "success", message: "¡Gracias! Te voy a responder pronto." });
      setForm(EMPTY_FORM);
    } catch (error) {
      setStatus({ state: "error", message: "No se pudo enviar. Probá de nuevo en unos minutos." });
    }
  }

  return (
    <Section id="contacto" title="Contacto" index="06">
      <div className="contact__inner">
        <div className="contact__text">
          <p>
            ¿Tenés un proyecto en mente o una oportunidad para conversar? Escribime por acá o
            directamente a <a href={`mailto:${email}`}>{email}</a>.
          </p>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn--primary" disabled={status.state === "sending"}>
            {status.state === "sending" ? "Enviando…" : "Enviar mensaje"}
          </button>

          <p
            className={`contact__status ${
              status.state === "success" ? "contact__status--ok" : ""
            } ${status.state === "error" ? "contact__status--error" : ""}`}
            role="status"
          >
            {status.message}
          </p>
        </form>
      </div>
    </Section>
  );
}
