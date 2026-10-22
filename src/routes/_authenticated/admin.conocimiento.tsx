import { createFileRoute } from "@tanstack/react-router";
import { checkKnowledgeAdmin } from "@/lib/knowledge.functions";
import { KnowledgeAdmin } from "@/components/knowledge/KnowledgeAdmin";
export const Route = createFileRoute("/_authenticated/admin/conocimiento")({
  loader: () => checkKnowledgeAdmin(),
  head: () => ({ meta: [{ title: "Administración de Conocimiento | MagnoCorp" }, { name: "description", content: "Administración privada de los recursos educativos y prospectos de MagnoCorp." }, { property: "og:title", content: "Administración de Conocimiento | MagnoCorp" }, { property: "og:description", content: "Área privada para el equipo de MagnoCorp." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminRoute,
});
function AdminRoute() { const { admin } = Route.useLoaderData(); return <KnowledgeAdmin admin={admin} />; }