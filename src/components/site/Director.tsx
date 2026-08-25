import { BadgeCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

const EXPERTISE = [
  "Dirección estratégica",
  "Administración y finanzas",
  "Consultoría empresarial",
  "Planeación comercial",
  "Marketing digital",
  "Inteligencia Artificial aplicada a negocios",
  "Finanzas empresariales",
  "Modelos de negocio",
  "Desarrollo de proyectos",
  "Capacitación empresarial",
  "Estrategias comerciales",
  "Desarrollo organizacional",
];

const CERTIFICATIONS = [
  "Prestación de servicios de consultoría en negocios",
  "Desarrollo de cursos de formación en línea",
  "Venta especializada de productos y servicios",
  "Impartición de cursos de capacitación",
  "Implementación de estrategias de mercadotecnia en medios digitales",
];

export function Director() {
  return (
    <section id="director" className="bg-secondary py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Dirección general" title="El conocimiento detrás de la estrategia" />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <article className="surface-navy flex h-full flex-col justify-between rounded-2xl p-8 lg:p-10">
              <div>
                <span
                  aria-hidden="true"
                  className="inline-flex size-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 font-display text-2xl font-extrabold text-white"
                >
                  JH
                </span>
                <h3 className="mt-6 text-2xl text-white">Juan Hernández</h3>
                <p className="mt-1 font-display text-sm font-bold tracking-[0.16em] text-[oklch(0.78_0.14_242)] uppercase">
                  Director General de MagnoCorp
                </p>
                <p className="mt-5 leading-relaxed text-white/70">
                  Licenciado en Sistemas Computacionales y Maestro en Administración, con más de 10 años de
                  experiencia en desarrollo empresarial, mercadotecnia, finanzas, capacitación en tecnologías de la
                  información, ventas y posicionamiento comercial.
                </p>
              </div>
              <p className="mt-8 font-display text-sm font-extrabold tracking-[0.12em] text-white uppercase">
                Estrategia + Tecnología + Innovación + Resultados
              </p>
            </article>
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={100}>
              <article className="card-elegant p-8">
                <h3 className="text-lg text-navy-deep">Áreas de experiencia</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {EXPERTISE.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-semibold text-navy-deep"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>

            <Reveal delay={180}>
              <article className="card-elegant p-8">
                <h3 className="text-lg text-navy-deep">Consultor certificado por la Red CONOCER / SEP</h3>
                <ul className="mt-5 space-y-3">
                  {CERTIFICATIONS.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                      <BadgeCheck className="mt-0.5 size-4.5 shrink-0 text-accent" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
