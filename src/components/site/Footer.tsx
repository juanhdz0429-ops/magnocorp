import { Facebook, Mail, MessageCircle } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import logo from "@/assets/magnocorp-logo.png.asset.json";
import { CONTACT, NAV_LINKS, waLink } from "@/lib/site-data";

const WHATSAPP_DEFAULT = "Hola MagnoCorp, me interesa recibir información sobre sus servicios de consultoría.";

export function Footer() {
  const pathname = useLocation({ select: (location) => location.pathname });
  return (
    <footer className="surface-navy">
      <div className="container-page grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <span className="inline-flex rounded-xl bg-white px-4 py-3">
            <img
              src={logo.url}
              alt="Logotipo de MagnoCorp"
              width={1920}
              height={592}
              loading="lazy"
              className="h-9 w-auto object-contain"
            />
          </span>
          <p className="mt-5 max-w-sm leading-relaxed text-white/65">
            Consultoría estratégica para empresas que quieren crecer.
          </p>
          <p className="mt-4 font-display text-xs font-bold tracking-[0.16em] text-[oklch(0.78_0.14_242)] uppercase">
            Diagnosticar · Estrategizar · Implementar · Medir · Mejorar
          </p>
        </div>

        <nav aria-label="Navegación del pie de página">
          <h2 className="font-display text-sm font-extrabold tracking-[0.14em] text-white uppercase">Navegación</h2>
          <ul className="mt-5 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                {link.path ? <Link to={link.path} className="text-sm text-white/65 transition-colors hover:text-white">{link.label}</Link> : <a href={pathname === "/" ? `#${link.id}` : `/#${link.id}`} className="text-sm text-white/65 transition-colors hover:text-white">
                  {link.label}
                </a>}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-extrabold tracking-[0.14em] text-white uppercase">Contacto</h2>
          <ul className="mt-5 space-y-2.5 text-sm text-white/65">
            <li>
              <a href={CONTACT.phoneHref} className="hover:text-white">
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
                {CONTACT.email}
              </a>
            </li>
            <li>{CONTACT.location}</li>
          </ul>
          <ul className="mt-6 flex gap-3">
            <li>
              <a
                href={waLink(WHATSAPP_DEFAULT)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escríbenos por WhatsApp"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/12"
              >
                <MessageCircle className="size-5" />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook MagnoCorp MZT"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/12"
              >
                <Facebook className="size-5" />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                aria-label="Enviar correo a MagnoCorp"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/12"
              >
                <Mail className="size-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="container-page text-center text-xs text-white/50">
          © 2026 MagnoCorp. Todos los derechos reservados.
          <Link to="/conocimiento/aviso-de-privacidad" className="ml-4 inline-block text-primary-foreground/70 underline hover:text-primary-foreground">Aviso de privacidad</Link>
          <Link to="/admin/conocimiento" className="ml-4 underline">Administración</Link>
        </p>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={waLink(WHATSAPP_DEFAULT)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a MagnoCorp por WhatsApp"
      className="fixed right-5 bottom-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[oklch(0.62_0.16_150)] text-white shadow-[var(--shadow-lift)] transition-transform hover:scale-110"
      style={{ animation: "magno-pulse 2.6s infinite" }}
    >
      <MessageCircle className="size-7" aria-hidden="true" />
    </a>
  );
}
