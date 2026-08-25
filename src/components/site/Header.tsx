import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/magnocorp-logo.png.asset.json";
import { NAV_LINKS } from "@/lib/site-data";
import { CtaLink } from "./ui";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/80 bg-background/90 py-2 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          : "border-b border-transparent bg-background/60 py-4 backdrop-blur-md",
      )}
    >
      <div className="container-page flex items-center justify-between gap-4">
        <a href="#inicio" className="flex shrink-0 items-center" aria-label="MagnoCorp — inicio">
          <img
            src={logo.url}
            alt="Logotipo de MagnoCorp"
            className={cn("w-auto object-contain transition-all duration-500", scrolled ? "h-9" : "h-11")}
            width={1920}
            height={592}
          />
        </a>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-navy-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <CtaLink href="#diagnostico" size="sm">
            SOLICITA TU DIAGNÓSTICO
          </CtaLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-navy-deep lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="menu-movil"
        hidden={!open}
        className="container-page mt-3 lg:hidden"
      >
        <nav aria-label="Navegación móvil" className="card-elegant flex flex-col gap-1 p-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-navy-deep transition-colors hover:bg-secondary"
            >
              {link.label}
            </a>
          ))}
          <CtaLink href="#diagnostico" onClick={() => setOpen(false)} className="mt-2 w-full">
            SOLICITA TU DIAGNÓSTICO
          </CtaLink>
        </nav>
      </div>
    </header>
  );
}
