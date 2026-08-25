import { Building2 } from "lucide-react";
import { CLIENTS, PROJECT_CASES } from "@/lib/site-data";
import { Counter, Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

export function Projects() {
  return (
    <section id="proyectos" className="bg-secondary py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Proyectos"
          title="Proyectos que generan resultados"
          subtitle="Durante nuestra trayectoria hemos atendido a más de 100 empresas y organizaciones, trabajando con el sector privado, sector público y organismos empresariales en proyectos de desarrollo comercial, marketing, capacitación, transformación digital y desarrollo empresarial."
        />

        <dl className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: 100, prefix: "+", label: "Empresas atendidas" },
            { value: 10, suffix: "+", label: "Años de experiencia" },
            { text: "Sector público + privado", label: "Experiencia multidisciplinaria" },
            { text: "Estrategia + Tecnología", label: "Soluciones integrales" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="card-elegant card-elegant-hover h-full p-7">
                <dt className="font-display text-2xl font-extrabold text-navy-deep sm:text-3xl">
                  {"text" in stat && stat.text ? (
                    <span className="text-xl sm:text-2xl">{stat.text}</span>
                  ) : (
                    <Counter value={stat.value as number} prefix={stat.prefix ?? ""} suffix={stat.suffix ?? ""} />
                  )}
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">{stat.label}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <div className="mt-20">
          <SectionHeading as="h3" title="Empresas y organizaciones con las que hemos colaborado" />
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CLIENTS.map((client, i) => (
              <Reveal as="li" key={client} delay={(i % 4) * 70}>
                <div className="card-elegant card-elegant-hover group flex h-28 flex-col items-center justify-center gap-2 p-4 text-center">
                  <Building2
                    className="size-5 text-accent opacity-70 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="font-display text-sm font-extrabold tracking-[0.06em] text-navy-deep uppercase">
                    {client}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="mt-20">
          <SectionHeading as="h3" title="Tipos de proyectos que desarrollamos" />
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROJECT_CASES.map((item, i) => (
              <Reveal as="li" key={item.area} delay={(i % 3) * 90}>
                <article className="card-elegant card-elegant-hover h-full p-7">
                  <p className="eyebrow">{item.sector}</p>
                  <h4 className="mt-3 text-lg text-navy-deep">{item.area}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
