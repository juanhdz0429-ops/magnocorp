import {
  Compass,
  TrendingUp,
  Megaphone,
  Cpu,
  Workflow,
  Users,
  GraduationCap,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import appsImage from "@/assets/apps.jpg";
import { SERVICES, waLink } from "@/lib/site-data";
import { Reveal } from "./Reveal";
import { CtaLink, SectionHeading } from "./ui";

const ICONS: Record<string, LucideIcon> = {
  Compass,
  TrendingUp,
  Megaphone,
  Cpu,
  Workflow,
  Users,
  GraduationCap,
};

const APP_EXAMPLES = [
  "Aplicaciones administrativas",
  "Sistemas internos",
  "Dashboards",
  "CRM",
  "Automatizaciones",
  "Formularios inteligentes",
  "Herramientas con Inteligencia Artificial",
  "Sistemas de reservaciones",
  "Aplicaciones de gestión",
];

export function Services() {
  return (
    <>
      <section id="servicios" className="bg-secondary py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Servicios"
            title="Soluciones para hacer crecer tu empresa"
            subtitle="Integramos estrategia, tecnología, marketing e innovación para ayudarte a resolver los principales retos de tu negocio."
          />

          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
              const Icon = ICONS[service.icon] ?? Compass;
              return (
                <Reveal as="li" key={service.id} delay={(i % 3) * 90}>
                  <article className="card-elegant card-elegant-hover group flex h-full flex-col p-8">
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[image:var(--gradient-accent)] text-primary-foreground">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-xl text-navy-deep">{service.title}</h3>
                    {service.intro ? (
                      <p className="mt-2 text-sm text-muted-foreground">{service.intro}</p>
                    ) : null}
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                          <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <CtaLink
                      href={waLink(
                        `Hola MagnoCorp, me interesa el servicio de ${service.title}. ${service.cta}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="sm"
                      className="mt-7 self-start"
                    >
                      {service.cta}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </CtaLink>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="aplicaciones" className="surface-navy relative overflow-hidden py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-32 size-[36rem] rounded-full bg-[radial-gradient(circle,oklch(0.6_0.178_258/0.3),transparent_65%)] blur-2xl"
        />
        <div className="container-page relative grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-[oklch(0.78_0.14_242)]">Desarrollo de aplicaciones</p>
            <h2 className="mt-3 text-3xl leading-tight text-white sm:text-4xl">
              También desarrollamos tecnología para tu empresa.
            </h2>
            <p className="mt-5 text-lg font-medium text-white/85">
              No todos los problemas empresariales se resuelven con una capacitación. Algunos necesitan una
              herramienta.
            </p>
            <p className="mt-4 leading-relaxed text-white/65">
              En MagnoCorp diseñamos y desarrollamos aplicaciones y soluciones digitales a la medida para ordenar la
              operación, automatizar tareas y facilitar la toma de decisiones dentro de cada empresa.
            </p>
            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {APP_EXAMPLES.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                  <Check className="mt-0.5 size-4 shrink-0 text-[oklch(0.78_0.14_242)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <CtaLink
              href={waLink("Hola MagnoCorp, quiero una aplicación para mi empresa.")}
              target="_blank"
              rel="noopener noreferrer"
              variant="solidLight"
              size="lg"
              className="mt-9"
            >
              QUIERO UNA APLICACIÓN PARA MI EMPRESA
            </CtaLink>
          </Reveal>

          <Reveal delay={120}>
            <img
              src={appsImage}
              alt="Aplicaciones empresariales, dashboards y sistemas internos desarrollados por MagnoCorp"
              loading="lazy"
              width={1024}
              height={768}
              className="w-full rounded-3xl border border-white/12 object-cover shadow-[0_40px_80px_-40px_oklch(0_0_0/0.8)]"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
