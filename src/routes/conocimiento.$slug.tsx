import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, BookOpen } from "lucide-react";
import { knowledgeCatalogOptions } from "@/lib/knowledge-queries";
import { ResourceAccess } from "@/components/knowledge/ResourceAccess";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { TYPE_LABELS } from "@/lib/knowledge";
export const Route = createFileRoute("/conocimiento/$slug")({
  loader: async ({ params, context }) => { const data = await context.queryClient.ensureQueryData(knowledgeCatalogOptions); const resource = data.resources.find(r => r.slug === params.slug); if (!resource) throw notFound(); return resource; },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} | Conocimiento MagnoCorp` : "Recurso no disponible | MagnoCorp";
    const description = loaderData?.description ?? "Recursos educativos gratuitos para tu negocio.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }, ...(loaderData ? [{ property: "og:url", content: `https://magnocorp.online/conocimiento/${loaderData.slug}` }] : []), ...(loaderData?.cover_url?.startsWith("https://") ? [{ property: "og:image", content: loaderData.cover_url }, { name: "twitter:image", content: loaderData.cover_url }] : []), ...(!loaderData ? [{ name: "robots", content: "noindex" }] : [])], links: loaderData ? [{ rel: "canonical", href: `https://magnocorp.online/conocimiento/${loaderData.slug}` }] : [] };
  },
  component: ResourcePage,
});
function ResourcePage() {
  const resource = Route.useLoaderData(); const { data } = useSuspenseQuery(knowledgeCatalogOptions); const [open, setOpen] = useState(false);
  return <><Header /><main className="container-page min-h-[70vh] pt-32 pb-20"><Button variant="link" asChild className="mb-8 px-0"><Link to="/conocimiento"><ArrowLeft />Biblioteca de recursos</Link></Button><p className="mb-4 text-sm font-semibold text-accent">{resource.category} · {TYPE_LABELS[resource.resource_type]} · GRATIS</p><h1 className="max-w-3xl text-3xl leading-tight text-primary sm:text-4xl">{resource.title}</h1><p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{resource.description}</p>{resource.cover_url ? <img src={resource.cover_url} alt={`Portada de ${resource.title}`} width={800} height={500} className="mt-8 max-h-80 w-full max-w-2xl rounded-lg object-cover" /> : <BookOpen className="mt-8 size-16 text-accent" />}<Button size="lg" className="mt-8" onClick={() => setOpen(true)}><Download />Obtener recurso gratis</Button></main><Footer /><ResourceAccess resource={open ? resource : null} privacy={data.privacy} onClose={() => setOpen(false)} /></>;
}