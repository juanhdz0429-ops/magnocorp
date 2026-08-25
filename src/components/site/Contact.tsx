import { useState, type FormEvent } from "react";
import { Facebook, Globe, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { CONTACT, waLink } from "@/lib/site-data";
import { submitContact } from "@/lib/leads.functions";
import { Reveal } from "./Reveal";
import { CtaButton, CtaLink, SectionHeading } from "./ui";

const SERVICES_OPTIONS = [
  "Consultoría empresarial",
  "Desarrollo comercial",
  "Marketing digital",
  "Inteligencia Artificial",
  "Procesos administrativos",
  "Capacitación",
  "Desarrollo de aplicaciones",
  "Otro",
];

type Form = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  website: string;
};

const EMPTY: Form = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  servicio: "",
  mensaje: "",
  website: "",
};

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent";

const labelClass = "mb-2 block font-display text-xs font-bold tracking-[0.08em] text-navy-deep uppercase";

const CARDS = [
  { label: "Teléfono", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref, Icon: Phone },
  { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, Icon: Mail },
  { label: "Website", value: CONTACT.website, href: `https://${CONTACT.website}`, Icon: Globe },
  { label: "Ubicación", value: CONTACT.location, Icon: MapPin },
  { label: "Facebook", value: CONTACT.facebook, href: "https://www.facebook.com/", Icon: Facebook },
];

export function Contact() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function validate() {
    const next: Partial<Record<keyof Form, string>> = {};
    if (form.nombre.trim().length < 2) next.nombre = "Escribe tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = "Correo electrónico no válido.";
    if (form.telefono.replace(/\D/g, "").length < 10) next.telefono = "Teléfono de al menos 10 dígitos.";
    if (!form.servicio) next.servicio = "Selecciona un servicio.";
    if (form.mensaje.trim().length < 10) next.mensaje = "Cuéntanos un poco más (mínimo 10 caracteres).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate() || status === "sending") return;
    setStatus("sending");
    try {
      await submitContact({ data: form });
      setStatus("sent");
      setForm(EMPTY);
    } catch (error) {
      console.error(error);
      setErrors({ mensaje: "No pudimos enviar la solicitud. Escríbenos por WhatsApp y te atendemos de inmediato." });
      setStatus("idle");
    }
  }

  return (
    <section id="contacto" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Contacto"
          title="Construyamos el siguiente paso de tu empresa."
          subtitle="Cuéntanos qué necesita tu negocio y un consultor de MagnoCorp se pondrá en contacto contigo."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid content-start gap-4">
            {CARDS.map((card, i) => (
              <Reveal key={card.label} delay={i * 70}>
                <div className="card-elegant card-elegant-hover flex items-center gap-4 p-5">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
                    <card.Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
                      {card.label}
                    </p>
                    {card.href ? (
                      <a
                        href={card.href}
                        target={card.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="block truncate font-semibold text-navy-deep hover:text-accent"
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-navy-deep">{card.value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={350}>
              <div className="card-elegant overflow-hidden">
                <iframe
                  title="Ubicación de MagnoCorp en Mazatlán, Sinaloa"
                  src="https://www.google.com/maps?q=Mazatl%C3%A1n%2C%20Sinaloa%2C%20M%C3%A9xico&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-56 w-full border-0"
                />
                <div className="p-4">
                  <CtaLink
                    href="https://www.google.com/maps/dir/?api=1&destination=Mazatl%C3%A1n%2C+Sinaloa%2C+M%C3%A9xico"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                  >
                    Cómo llegar
                  </CtaLink>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <form onSubmit={onSubmit} noValidate className="card-elegant p-7 sm:p-9">
              <h3 className="text-xl text-navy-deep">Solicita información</h3>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="c-nombre">
                    Nombre
                  </label>
                  <input
                    id="c-nombre"
                    className={inputClass}
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    aria-invalid={Boolean(errors.nombre)}
                    required
                  />
                  {errors.nombre ? <p className="mt-1.5 text-xs text-destructive">{errors.nombre}</p> : null}
                </div>
                <div>
                  <label className={labelClass} htmlFor="c-empresa">
                    Empresa
                  </label>
                  <input
                    id="c-empresa"
                    className={inputClass}
                    value={form.empresa}
                    onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="c-email">
                    Correo electrónico
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    aria-invalid={Boolean(errors.email)}
                    required
                  />
                  {errors.email ? <p className="mt-1.5 text-xs text-destructive">{errors.email}</p> : null}
                </div>
                <div>
                  <label className={labelClass} htmlFor="c-telefono">
                    Teléfono
                  </label>
                  <input
                    id="c-telefono"
                    type="tel"
                    className={inputClass}
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    aria-invalid={Boolean(errors.telefono)}
                    required
                  />
                  {errors.telefono ? <p className="mt-1.5 text-xs text-destructive">{errors.telefono}</p> : null}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="c-servicio">
                    Servicio de interés
                  </label>
                  <select
                    id="c-servicio"
                    className={inputClass}
                    value={form.servicio}
                    onChange={(e) => setForm({ ...form, servicio: e.target.value })}
                    aria-invalid={Boolean(errors.servicio)}
                    required
                  >
                    <option value="">Selecciona…</option>
                    {SERVICES_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.servicio ? <p className="mt-1.5 text-xs text-destructive">{errors.servicio}</p> : null}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="c-mensaje">
                    Mensaje
                  </label>
                  <textarea
                    id="c-mensaje"
                    rows={5}
                    maxLength={1500}
                    className={inputClass}
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    aria-invalid={Boolean(errors.mensaje)}
                    required
                  />
                  {errors.mensaje ? <p className="mt-1.5 text-xs text-destructive">{errors.mensaje}</p> : null}
                </div>
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="c-website">No llenar</label>
                <input
                  id="c-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <CtaButton type="submit" size="lg" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Enviando solicitud…
                    </>
                  ) : (
                    <>
                      ENVIAR SOLICITUD <Send className="size-4" />
                    </>
                  )}
                </CtaButton>
                <CtaLink
                  variant="whatsapp"
                  href={waLink("Hola MagnoCorp, me interesa recibir información sobre sus servicios de consultoría.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contactar por WhatsApp
                </CtaLink>
              </div>

              <p aria-live="polite" className="mt-4 text-sm font-semibold text-accent">
                {status === "sent"
                  ? "¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto contigo."
                  : ""}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
