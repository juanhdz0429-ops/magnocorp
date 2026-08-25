import { Target, Rocket, RefreshCw, Award } from "lucide-react";
import { METHODOLOGY, VALUES } from "@/lib/site-data";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

const PILLARS = [
  {
    n: "01",
    title: "Estrategia",
    text: "Analizamos el negocio y diseñamos estrategias alineadas con sus objetivos.",
    Icon: Target,
  },
  {
    n: "02",
    title: "Implementación",
    text: "Convertimos las estrategias en acciones, procesos y herramientas concretas.",
    Icon: Rocket,
  },
  {
    n: "03",
    title: "Mejora continua",
    text: "Medimos resultados, detectamos oportunidades y optimizamos continuamente.",
    Icon: RefreshCw,
  },
];

export function About() {
  return (
    <>
      <section id="magnocorp" className="py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="¿Qué es MagnoCorp?"
            title="Más que una consultoría, somos tu aliado estratégico."
            subtitle="Cada empresa enfrenta retos diferentes. En MagnoCorp analizamos la realidad de cada negocio para desarrollar estrategias y soluciones personalizadas que combinen conocimiento empresarial, tecnología e innovación."
          />

          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <Reveal as="li" key={pillar.n} delay={i * 100}>
                <article className="card-elegant card-elegant-hover h-full p-8">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-accent">
                      <pillar.Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="font-display text-3xl font-extrabold text-border">{pillar.n}</span>
                  </div>
                  <h3 className="mt-6 text-xl text-navy-deep">{pillar.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{pillar.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="mision" className="bg-secondary py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Identidad corporativa" title="Misión, visión y valores" />

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="card-elegant h-full p-8 lg:p-10">
                <p className="eyebrow">Misión</p>
                <p className="mt-4 text-lg leading-relaxed text-navy-deep">
                  Impulsar el desarrollo de las empresas mediante consultoría, capacitación, innovación y tecnología,
                  generando soluciones prácticas que contribuyan a su crecimiento y rentabilidad.
                </p>
              </article>
            </Reveal>
            <Reveal delay={100}>
              <article className="surface-navy h-full rounded-2xl p-8 lg:p-10">
                <p className="eyebrow text-[oklch(0.78_0.14_242)]">Visión</p>
                <p className="mt-4 text-lg leading-relaxed text-white/90">
                  Ser una consultoría empresarial referente en el noroeste de México por su capacidad para transformar
                  empresas mediante estrategia, innovación e inteligencia artificial.
                </p>
              </article>
            </Reveal>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal as="li" key={value} delay={i * 60}>
                <div className="card-elegant card-elegant-hover flex h-full items-center gap-3 p-5">
                  <Award className="size-5 shrink-0 text-accent" aria-hidden="true" />
                  <span className="font-display text-sm font-bold text-navy-deep">{value}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="metodologia" className="py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Filosofía de trabajo"
            title="Nuestra metodología"
            subtitle="Un mismo camino de trabajo para cada proyecto: entender, diseñar, ejecutar, medir y mejorar."
          />

          <ol className="relative mt-16 grid gap-8 lg:grid-cols-5">
            <span
              aria-hidden="true"
              className="absolute top-6 right-0 left-0 hidden h-px bg-[linear-gradient(90deg,transparent,var(--color-border),transparent)] lg:block"
            />
            {METHODOLOGY.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 90} className="relative">
                <div className="flex flex-col items-start gap-4 lg:items-center lg:text-center">
                  <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-full bg-[image:var(--gradient-accent)] font-display text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-soft)]">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-extrabold tracking-[0.08em] text-navy-deep uppercase">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
