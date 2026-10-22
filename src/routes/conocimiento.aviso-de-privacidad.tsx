import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { KNOWLEDGE_PRIVACY, PRIVACY_SECTIONS } from "@/lib/knowledge-privacy";

const title = "Aviso de privacidad de Conocimiento | MagnoCorp";
const description = "Consulta los datos solicitados para recursos gratuitos de MagnoCorp, sus finalidades y el contacto para ejercer tus derechos de privacidad.";

export const Route = createFileRoute("/conocimiento/aviso-de-privacidad")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "https://magnocorp.online/conocimiento/aviso-de-privacidad" }],
  }),
  component: PrivacyNoticePage,
});

function PrivacyNoticePage() {
  return <div className="knowledge-page">
    <Header />
    <main className="pt-24">
      <section className="border-b border-border bg-secondary">
        <div className="container-page py-10 sm:py-14">
          <Button asChild variant="link" className="mb-6 h-auto px-0"><Link to="/conocimiento"><ArrowLeft />Volver a Conocimiento</Link></Button>
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase text-accent"><ShieldCheck className="size-4" />MagnoCorp · Conocimiento</p>
          <h1 className="max-w-3xl text-3xl leading-tight text-primary sm:text-4xl">Aviso de privacidad</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Información sobre tus datos al solicitar recursos gratuitos y cómo ejercer tus derechos.</p>
          <p className="mt-5 text-sm text-muted-foreground">Última revisión: {KNOWLEDGE_PRIVACY.revisedOn} · {KNOWLEDGE_PRIVACY.version}</p>
        </div>
      </section>
      <div className="container-page grid items-start gap-10 py-8 pb-16 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28">
          <nav aria-label="Contenido del aviso de privacidad" className="border-y border-border py-5">
            <p className="mb-4 text-xs font-semibold uppercase text-accent">En este aviso</p>
            <ol className="space-y-3">{PRIVACY_SECTIONS.map((section, i) => <li key={section.id}><a href={`#${section.id}`} className="flex gap-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:text-primary"><span className="w-5 shrink-0 text-accent">{i + 1}.</span>{section.title}</a></li>)}</ol>
          </nav>
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-primary">Contacto de privacidad</p>
            <Button asChild variant="outline" className="h-auto min-h-11 w-full justify-start whitespace-normal text-left"><a href={`mailto:${KNOWLEDGE_PRIVACY.contactEmail}?subject=Solicitud%20de%20privacidad`}><Mail className="shrink-0" /><span className="min-w-0 break-all">{KNOWLEDGE_PRIVACY.contactEmail}</span></a></Button>
          </div>
        </aside>
        <article className="min-w-0 max-w-3xl divide-y divide-border">
          {PRIVACY_SECTIONS.map((section, i) => <section key={section.id} id={section.id} className="py-7 first:pt-0">
            <h2 className="text-xl leading-snug text-primary">{i + 1}. {section.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>)}
        </article>
      </div>
    </main>
    <Footer />
  </div>;
}