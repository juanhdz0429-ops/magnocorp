import { useState } from "react";
import { ArrowRight, CalendarDays, X } from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "@/lib/site-data";
import { Reveal } from "./Reveal";
import { CtaButton, SectionHeading } from "./ui";

const formatter = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });

function cover(post: BlogPost) {
  const hue = (post.slug.length * 37) % 40;
  return `linear-gradient(135deg, oklch(0.28 0.088 ${230 + hue}), oklch(0.55 0.16 ${240 + hue}))`;
}

export function Blog() {
  const [active, setActive] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Blog"
          title="Ideas para hacer crecer tu empresa"
          subtitle="Artículos prácticos sobre estrategia, procesos, marketing digital e Inteligencia Artificial aplicada a los negocios."
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BLOG_POSTS.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={(i % 4) * 80}>
              <article className="card-elegant card-elegant-hover flex h-full flex-col overflow-hidden">
                <div
                  className="relative h-36 w-full"
                  style={{ backgroundImage: cover(post) }}
                  role="img"
                  aria-label={`Imagen de portada del artículo ${post.title}`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-25 [background-image:linear-gradient(oklch(1_0_0/0.5)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.5)_1px,transparent_1px)] [background-size:28px_28px]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-display font-bold text-accent">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      <time dateTime={post.date}>{formatter.format(new Date(`${post.date}T12:00:00`))}</time>
                    </span>
                  </div>
                  <h3 className="mt-3 text-base leading-snug text-navy-deep">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                  <CtaButton variant="outline" size="sm" className="mt-5 self-start" onClick={() => setActive(post)}>
                    Leer artículo
                    <ArrowRight className="size-4" />
                  </CtaButton>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-navy-ink/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActive(null)}
        >
          <div
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-background p-7 sm:rounded-3xl sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{active.category}</p>
                <h3 className="mt-2 text-2xl text-navy-deep">{active.title}</h3>
                <time dateTime={active.date} className="mt-2 block text-xs text-muted-foreground">
                  {formatter.format(new Date(`${active.date}T12:00:00`))}
                </time>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Cerrar artículo"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border text-navy-deep hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {active.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-foreground/80">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
