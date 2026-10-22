import { createFileRoute } from "@tanstack/react-router";
import { KnowledgePage } from "@/components/knowledge/KnowledgePage";
import { knowledgeCatalogOptions } from "@/lib/knowledge-queries";
const title = "Conocimiento y Recursos Gratuitos | MagnoCorp";
const description = "Descarga recursos gratuitos sobre inteligencia artificial, marketing digital, emprendimiento y productividad empresarial con MagnoCorp";
export const Route = createFileRoute("/conocimiento/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(knowledgeCatalogOptions),
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: "https://magnocorp.online/conocimiento" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "https://magnocorp.online/conocimiento" }] }),
  component: KnowledgePage,
});