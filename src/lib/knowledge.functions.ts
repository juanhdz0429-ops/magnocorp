import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { accessSchema, resourceSchema, settingsSchema, dateFilterSchema, canDownload, isPublished, csvCell, FILE_MIME_TYPES, COVER_MIME_TYPES, type AccessResult, type PublicResource } from "./knowledge";

export const getKnowledgeCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient, browserStorageUrl } = await import("./knowledge.server");
  const client = publicClient();
  const [catalog, settings] = await Promise.all([
    client.from("public_resources").select("*").order("published_at", { ascending: false }).limit(1000),
    client.from("knowledge_settings").select("privacy_notice_url,privacy_notice_version").eq("id", true).maybeSingle(),
  ]);
  if (catalog.error || settings.error) return { resources: [] as PublicResource[], privacy: null, error: "No pudimos cargar la biblioteca. Inténtalo nuevamente." };
  const resources: PublicResource[] = [];
  for (const row of catalog.data ?? []) {
    if (!row.id || !row.title || !row.slug || !row.description || !row.category || !row.resource_type) continue;
    let cover_url: string | null = null;
    if (row.cover_storage_key) {
      const signed = await client.storage.from("knowledge-covers").createSignedUrl(row.cover_storage_key, 3600);
      if (signed.data) cover_url = browserStorageUrl(signed.data.signedUrl);
    }
    resources.push({ id: row.id, title: row.title, slug: row.slug, description: row.description, category: row.category, resource_type: row.resource_type, cover_url, duration: row.duration, download_enabled: row.download_enabled ?? false, access_button_text: row.access_button_text ?? "Descargar mi recurso", published_at: row.published_at });
  }
  return { resources, privacy: settings.data, error: null };
});

export const requestResourceAccess = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => accessSchema.parse(input))
  .handler(async ({ data }): Promise<AccessResult> => {
    setResponseHeader("Cache-Control", "no-store");
    const { publicClient, browserStorageUrl } = await import("./knowledge.server");
    const publicDb = publicClient();
    const settings = await publicDb.from("knowledge_settings").select("privacy_notice_url,privacy_notice_version").eq("id", true).maybeSingle();
    if (!settings.data?.privacy_notice_url || settings.data.privacy_notice_version === "pending") return { ok: false, error: "El acceso estará disponible cuando MagnoCorp publique su aviso de privacidad." };
    const published = await publicDb.from("public_resources").select("id").eq("id", data.resource_id).maybeSingle();
    if (!published.data) return { ok: false, error: "Este recurso no está disponible. Elige otro material." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const identity = getRequest().headers.get("cf-connecting-ip") ?? new URL(getRequest().url).hostname;
    const hashBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(identity + ":" + (process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "")));
    const keyHash = Array.from(new Uint8Array(hashBytes)).map(v => v.toString(16).padStart(2, "0")).join("");
    const allowed = await supabaseAdmin.rpc("consume_resource_limit", { p_hash: keyHash });
    if (allowed.error || !allowed.data) return { ok: false, error: "Has realizado varias solicitudes. Espera unos minutos antes de intentarlo nuevamente." };
    const resource = await supabaseAdmin.from("resources").select("*").eq("id", data.resource_id).maybeSingle();
    const r = resource.data;
    if (!r || !isPublished(r)) return { ok: false, error: "El recurso ya no está publicado." };
    let url = r.video_url ?? "";
    let download_url: string | null = null;
    if (r.file_storage_key) {
      const available = await supabaseAdmin.storage.from("knowledge-files").info(r.file_storage_key);
      if (available.error || !available.data) return { ok: false, error: "El archivo no está disponible. Inténtalo más tarde." };
      const signed = await supabaseAdmin.storage.from("knowledge-files").createSignedUrl(r.file_storage_key, 600);
      if (!signed.data) return { ok: false, error: "No se pudo preparar el recurso. Inténtalo nuevamente." };
      url = browserStorageUrl(signed.data.signedUrl);
      if (canDownload(r)) {
        const dl = await supabaseAdmin.storage.from("knowledge-files").createSignedUrl(r.file_storage_key, 600, { download: r.file_storage_key.split("/").pop() ?? true });
        if (!dl.data) return { ok: false, error: "No se pudo preparar la descarga." };
        download_url = browserStorageUrl(dl.data.signedUrl);
      }
    }
    if (!url) return { ok: false, error: "El material no está disponible." };
    const record = await supabaseAdmin.rpc("record_resource_access", { p_resource: r.id, p_name: data.full_name, p_email: data.email, p_phone: data.phone, p_privacy: settings.data.privacy_notice_version, p_consent: data.marketing_consent });
    if (record.error || !record.data) return { ok: false, error: "No pudimos guardar tu solicitud. Vuelve a intentarlo." };
    return { ok: true, url, download_url, mode: r.resource_type === "video" ? "video" : "file", expires_at: new Date(Date.now() + 600000).toISOString() };
  });

export const checkKnowledgeAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc("claim_first_admin");
  if (error) return { admin: false };
  return { admin: Boolean(data) };
});

export const listAdminResources = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ search: z.string().trim().max(100).default(""), status: z.enum(["all", "draft", "published", "archived"]).default("all"), page: z.number().int().min(0).default(0), sort: z.enum(["newest", "title"]).default("newest") }).parse(input))
  .handler(async ({ context, data }) => {
    const { requireAdmin } = await import("./knowledge.server");
    await requireAdmin(context.supabase, context.userId);
    let query = context.supabase.from("resources").select("*", { count: "exact" });
    if (data.search) query = query.ilike("title", `%${data.search.replace(/[%_]/g, "")}%`);
    if (data.status !== "all") query = query.eq("status", data.status);
    const result = await query.order(data.sort === "title" ? "title" : "created_at", { ascending: data.sort === "title" }).range(data.page * 12, data.page * 12 + 11);
    const settings = await context.supabase.from("knowledge_settings").select("*").eq("id", true).maybeSingle();
    if (result.error || settings.error) throw new Error("No se pudieron cargar los recursos.");
    return { resources: result.data ?? [], count: result.count ?? 0, settings: settings.data };
  });

export const saveResource = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => resourceSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { requireAdmin, verifyStoredFile } = await import("./knowledge.server");
    await requireAdmin(context.supabase, context.userId);
    const settings = await context.supabase.from("knowledge_settings").select("max_file_mb").eq("id", true).maybeSingle();
    if (data.file_storage_key) await verifyStoredFile(context.supabase, "knowledge-files", data.file_storage_key, data.resource_type, settings.data?.max_file_mb ?? 50);
    if (data.cover_storage_key) await verifyStoredFile(context.supabase, "knowledge-covers", data.cover_storage_key, "cover", 5);
    const { id, ...fields } = data;
    const row = { ...fields, cover_storage_key: data.cover_storage_key || null, file_storage_key: data.file_storage_key || null, video_url: data.video_url || null, published_at: data.status === "published" ? data.published_at ?? new Date().toISOString() : data.published_at };
    const result = id ? await context.supabase.from("resources").update(row).eq("id", id).select("id").single() : await context.supabase.from("resources").insert({ ...row, created_by: context.userId }).select("id").single();
    if (result.error) throw new Error(result.error.code === "23505" ? "Ya existe un recurso con esa dirección." : "No pudimos guardar el recurso.");
    return { id: result.data.id };
  });

export const deleteResource = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input)).handler(async ({ context, data }) => {
  const { requireAdmin } = await import("./knowledge.server");
  await requireAdmin(context.supabase, context.userId);
  const row = await context.supabase.from("resources").select("file_storage_key,cover_storage_key").eq("id", data.id).single();
  const result = await context.supabase.from("resources").delete().eq("id", data.id);
  if (result.error) throw new Error("No pudimos eliminar el recurso.");
  // Remove only files no longer referenced by another resource.
  for (const [bucket, column, path] of [["knowledge-files", "file_storage_key", row.data?.file_storage_key], ["knowledge-covers", "cover_storage_key", row.data?.cover_storage_key]] as const) {
    if (!path) continue;
    const refs = await context.supabase.from("resources").select("id").eq(column, path).limit(1);
    if (refs.data?.length === 0) await context.supabase.storage.from(bucket).remove([path]);
  }
  return { ok: true };
});

export const prepareKnowledgeUpload = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ type: z.enum(["pdf", "video", "other", "cover"]), mime: z.string().max(150), size: z.number().int().positive(), extension: z.enum(["pdf", "mp4", "webm", "xlsx", "docx", "csv", "jpg", "jpeg", "png", "webp"]) }).parse(input))
  .handler(async ({ context, data }) => {
    const { requireAdmin, browserStorageUrl } = await import("./knowledge.server");
    await requireAdmin(context.supabase, context.userId);
    const settings = await context.supabase.from("knowledge_settings").select("max_file_mb").eq("id", true).maybeSingle();
    const max = data.type === "cover" ? 5 : settings.data?.max_file_mb ?? 50;
    const types = data.type === "cover" ? COVER_MIME_TYPES : FILE_MIME_TYPES[data.type];
    if (!types.includes(data.mime) || data.size > max * 1024 * 1024) throw new Error(`Formato no permitido o archivo mayor a ${max} MB.`);
    const bucket = data.type === "cover" ? "knowledge-covers" : "knowledge-files";
    const path = `${context.userId}/${crypto.randomUUID()}.${data.extension}`;
    const result = await context.supabase.storage.from(bucket).createSignedUploadUrl(path);
    if (!result.data) throw new Error("No se pudo iniciar la carga.");
    return { path, url: browserStorageUrl(result.data.signedUrl) };
  });

export const saveKnowledgeSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input: unknown) => settingsSchema.parse(input)).handler(async ({ context, data }) => {
  const { requireAdmin } = await import("./knowledge.server");
  await requireAdmin(context.supabase, context.userId);
  const result = await context.supabase.from("knowledge_settings").upsert({ id: true, ...data, privacy_notice_url: data.privacy_notice_url || null, updated_at: new Date().toISOString() });
  if (result.error) throw new Error("No pudimos guardar la configuración.");
  return { ok: true };
});

export const getKnowledgeMetrics = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input: unknown) => dateFilterSchema.parse(input)).handler(async ({ context, data }) => {
  const { requireAdmin } = await import("./knowledge.server");
  await requireAdmin(context.supabase, context.userId);
  const params = { p_from: data.from, p_to: data.to, ...(data.resource_id ? { p_resource: data.resource_id } : {}) };
  const [metrics, leads] = await Promise.all([
    context.supabase.rpc("knowledge_metrics", params),
    context.supabase.rpc("knowledge_lead_export", params, { count: "exact" }).range(data.page * 25, data.page * 25 + 24),
  ]);
  if (metrics.error || leads.error) throw new Error("No pudimos cargar los prospectos.");
  return { metrics: metrics.data, leads: leads.data ?? [], count: leads.count ?? 0 };
});

export const exportKnowledgeLeads = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input: unknown) => dateFilterSchema.parse(input)).handler(async ({ context, data }) => {
  setResponseHeader("Cache-Control", "no-store");
  const { requireAdmin } = await import("./knowledge.server");
  await requireAdmin(context.supabase, context.userId);
  const rows: unknown[][] = [["Nombre", "Correo", "Teléfono", "Consentimiento comercial", "Versión de privacidad", "Fecha de solicitud", "Recurso"]];
  for (let offset = 0; ; offset += 1000) {
    const result = await context.supabase.rpc("knowledge_lead_export", { p_from: data.from, p_to: data.to, ...(data.resource_id ? { p_resource: data.resource_id } : {}) }).range(offset, offset + 999);
    if (result.error) throw new Error("No se pudo exportar la información.");
    rows.push(...(result.data ?? []).map(r => [r.full_name, r.email, r.phone, r.marketing_consent ? "Sí" : "No", r.privacy_notice_version, r.requested_at, r.resource_title]));
    if ((result.data?.length ?? 0) < 1000) break;
  }
  return { csv: "\uFEFF" + rows.map(r => r.map(csvCell).join(",")).join("\r\n") };
});