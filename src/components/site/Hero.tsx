import heroImage from "@/assets/hero-tech.jpg";
import { Counter, Reveal } from "./Reveal";
import { CtaLink } from "./ui";

const STATS = [
  { value: 100, prefix: "+", label: "Empresas atendidas" },
  { value: 10, suffix: "+", label: "Años de experiencia" },
  { value: 2, label: "Ciudades / regiones de operación" },
  { text: "IA", label: "Aplicada a negocios" },
];

export function Hero() {
  return (
    <section id="inicio" className="surface-navy relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pt-40 lg:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 size-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.6_0.178_258/0.35),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(oklch(1_0_0/0.35)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.35)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="eyebrow mb-4 text-[oklch(0.78_0.12_240)]">
              Consultoría · Marketing · Inteligencia Artificial
            </p>
            <h1 className="text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]">
              Transformamos empresas.
              <br />
              <span className="text-[oklch(0.78_0.14_242)]">Impulsamos resultados.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg font-medium text-white/85">
              Consultoría estratégica, marketing, tecnología e inteligencia artificial para empresas que quieren
              crecer.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-white/65">
              En MagnoCorp ayudamos a pequeñas y medianas empresas a desarrollar estrategias, optimizar procesos y
              aprovechar la tecnología para construir negocios más rentables, competitivos y sustentables.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CtaLink href="#diagnostico" variant="solidLight" size="lg">
                SOLICITA TU DIAGNÓSTICO
              </CtaLink>
              <CtaLink href="#servicios" variant="ghostLight" size="lg">
                CONOCE NUESTROS SERVICIOS
              </CtaLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/15 shadow-[0_40px_80px_-40px_oklch(0_0_0/0.8)]">
              <img
                src={heroImage}
                alt="Visualización de datos y crecimiento empresarial impulsado por tecnología"
                width={1280}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-white/15 bg-navy-ink/85 px-5 py-4 backdrop-blur-md sm:block">
              <p className="font-display text-xs font-bold tracking-[0.18em] text-[oklch(0.78_0.14_242)]">
                METODOLOGÍA
              </p>
              <p className="mt-1 font-display text-sm font-bold text-white">
                Diagnosticar → Estrategizar → Implementar → Medir → Mejorar
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="container-page relative mt-20">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="bg-navy-ink/70 px-6 py-7 backdrop-blur-sm">
              <dt className="font-display text-3xl font-extrabold text-white">
                {"text" in stat && stat.text ? (
                  stat.text
                ) : (
                  <Counter value={stat.value as number} prefix={stat.prefix ?? ""} suffix={stat.suffix ?? ""} />
                )}
              </dt>
              <dd className="mt-1 text-sm text-white/65">{stat.label}</dd>
              <span className="sr-only">{i + 1}</span>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
