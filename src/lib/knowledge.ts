import { z } from "zod";

export const CATEGORIES = ["Inteligencia artificial", "Marketing digital", "Ventas", "Emprendimiento", "Productividad", "Innovación empresarial"] as const;
export const RESOURCE_TYPES = ["pdf", "video", "other"] as const;
export const TYPE_LABELS = { pdf: "PDF", video: "Video", other: "Plantilla" };
export const FILE_MIME_TYPES = { pdf: ["application/pdf"], video: ["video/mp4", "video/webm"], other: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/csv"] };
export const COVER_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const phoneSchema = z.string().trim().max(30, "El teléfono es demasiado largo.").transform(v => v.replace(/[\s().-]/g, "")).refine(v => !v || /^\+?[0-9]{10,15}$/.test(v), "Escribe un teléfono válido de 10 a 15 dígitos; incluye + y código de país si corresponde.");
export const accessSchema = z.object({
  resource_id: z.string().uuid(),
  full_name: z.string().trim().min(2, "Escribe tu nombre completo.").max(100, "El nombre debe tener como máximo 100 caracteres."),
  email: z.string().trim().toLowerCase().email("Escribe un correo electrónico válido.").max(255),
  phone: phoneSchema.optional().default(""),
  marketing_consent: z.boolean().default(false),
  website: z.string().max(0, "No se pudo procesar la solicitud.").optional().default(""),
});
const optionalUrl = z.string().trim().max(1000).refine(v => !v || /^https:\/\//.test(v), "La dirección debe comenzar con https://.").refine(v => { if (!v) return true; try { const u = new URL(v); return !u.username && !u.password; } catch { return false; } }, "Escribe una dirección válida.").default("");
const storageKey = z.string().max(250).regex(/^(?:[a-zA-Z0-9_/-]+\.[a-zA-Z0-9]+)?$/, "Archivo inválido.").default("");
export const resourceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3, "El título necesita al menos 3 caracteres.").max(160),
  slug: z.string().trim().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa letras minúsculas, números y guiones en la dirección."),
  description: z.string().trim().min(10, "Agrega una descripción de al menos 10 caracteres.").max(600),
  category: z.enum(CATEGORIES),
  resource_type: z.enum(RESOURCE_TYPES),
  cover_storage_key: storageKey,
  file_storage_key: storageKey,
  video_url: optionalUrl,
  duration: z.string().trim().max(60).default(""),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().datetime({ offset: true }).nullable().default(null),
  download_enabled: z.boolean().default(true),
  access_button_text: z.string().trim().min(3).max(60).default("Descargar mi recurso"),
}).superRefine((r, ctx) => {
  if (r.status !== "published") return;
  if (r.resource_type === "video" ? !r.file_storage_key && !r.video_url : !r.file_storage_key) ctx.addIssue({ code: "custom", path: ["file_storage_key"], message: "Carga el archivo o agrega un video antes de publicar." });
  if (r.resource_type !== "video" && !r.download_enabled) ctx.addIssue({ code: "custom", path: ["download_enabled"], message: "Habilita la descarga para publicar este archivo." });
  if (r.resource_type === "video" && r.download_enabled && !r.file_storage_key) ctx.addIssue({ code: "custom", path: ["download_enabled"], message: "Un video externo solo puede verse en línea; carga el archivo para habilitar su descarga." });
});

export const settingsSchema = z.object({ privacy_notice_url: optionalUrl, privacy_notice_version: z.string().trim().min(1).max(80), max_file_mb: z.number().int().min(1).max(50) });
export const dateFilterSchema = z.object({ from: z.string().datetime({ offset: true }), to: z.string().datetime({ offset: true }), resource_id: z.string().uuid().nullable().default(null), page: z.number().int().min(0).default(0) }).refine(v => v.from <= v.to, "La fecha inicial debe ser anterior a la final.");

export function canDownload(r: { resource_type: string; download_enabled: boolean; file_storage_key?: string | null }) {
  return r.download_enabled && Boolean(r.file_storage_key);
}
export function accessLimitIdentity(ip: string | null, email: string) {
  return ip ? `ip:${ip}` : `email:${email.trim().toLowerCase()}`;
}
export function isPublished(r: { status: string; published_at: string | null }, now = Date.now()) {
  return r.status === "published" && Boolean(r.published_at) && Date.parse(r.published_at ?? "") <= now;
}
export function csvCell(value: unknown) {
  const s = String(value ?? "");
  return `"${(/^[=+\-@\t\r]/.test(s) ? "'" : "") + s.replace(/"/g, '""')}"`;
}
export function slugify(v: string) {
  return v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export type ResourceInput = z.infer<typeof resourceSchema>;
export type AccessInput = z.infer<typeof accessSchema>;
export type PublicResource = { id: string; title: string; slug: string; description: string; category: string; resource_type: "pdf" | "video" | "other"; cover_url: string | null; duration: string | null; download_enabled: boolean; access_button_text: string; published_at: string | null };
export type AccessResult = { ok: true; url: string; download_url: string | null; mode: "file" | "video"; expires_at: string; } | { ok: false; error: string };