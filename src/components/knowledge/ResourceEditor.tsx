import { useState, type FormEvent, type ChangeEvent } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { Upload, Save, LoaderCircle, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { resourceSchema, CATEGORIES, slugify, type ResourceInput } from "@/lib/knowledge";
import { saveResource, prepareKnowledgeUpload } from "@/lib/knowledge.functions";
import type { Database } from "@/integrations/supabase/types";

export type ResourceRow = Database["public"]["Tables"]["resources"]["Row"];
export function ResourceEditor({ resource, open, maxMb, onClose, onSaved }: { resource: ResourceRow | null; open: boolean; maxMb: number; onClose: () => void; onSaved: () => void }) {
  const [type, setType] = useState<ResourceInput["resource_type"]>(resource?.resource_type ?? "pdf");
  const [file, setFile] = useState(resource?.file_storage_key ?? "");
  const [cover, setCover] = useState(resource?.cover_storage_key ?? "");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState(resource?.slug ?? "");
  const prepare = useServerFn(prepareKnowledgeUpload);
  const save = useServerFn(saveResource);
  async function upload(event: ChangeEvent<HTMLInputElement>, kind: "cover" | ResourceInput["resource_type"]) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setError(""); setProgress(0);
    try {
      const extension = z.enum(["pdf", "mp4", "webm", "xlsx", "docx", "csv", "jpg", "jpeg", "png", "webp"]).parse(selected.name.split(".").pop()?.toLowerCase() ?? "");
      const args = { type: kind, mime: selected.type || (extension === "csv" ? "text/csv" : ""), size: selected.size, extension };
      const validated = await prepare({ data: args });
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest(); xhr.open("PUT", validated.url);
        xhr.setRequestHeader("Content-Type", args.mime); xhr.setRequestHeader("x-upsert", "false");
        xhr.upload.onprogress = e => { if (e.lengthComputable) setProgress(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("La carga falló. Inténtalo nuevamente."));
        xhr.onerror = () => reject(new Error("Se interrumpió la conexión durante la carga."));
        xhr.timeout = 120000; xhr.ontimeout = () => reject(new Error("La carga tardó demasiado. Inténtalo nuevamente."));
        xhr.send(selected);
      });
      if (kind === "cover") setCover(validated.path); else setFile(validated.path);
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo cargar el archivo."); }
    finally { setProgress(null); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || progress !== null) return;
    const fd = new FormData(event.currentTarget);
    const date = String(fd.get("published_at") ?? "");
    const parsed = resourceSchema.safeParse({ id: resource?.id, title: fd.get("title"), slug, description: fd.get("description"), category: fd.get("category"), resource_type: type, cover_storage_key: cover, file_storage_key: file, video_url: fd.get("video_url") ?? "", duration: fd.get("duration"), status: fd.get("status"), published_at: date ? new Date(date).toISOString() : null, download_enabled: fd.get("download_enabled") === "on", access_button_text: fd.get("access_button_text") });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Revisa los campos."); return; }
    setBusy(true); setError("");
    try { await save({ data: parsed.data }); onSaved(); }
    catch (e) { setError(e instanceof Error ? e.message : "No se pudo guardar el recurso."); }
    finally { setBusy(false); }
  }
  const inputClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
  return <Dialog open={open} onOpenChange={v => { if (!v && !busy && progress === null) onClose(); }}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-lg border-border bg-background shadow-[var(--shadow-lift)]"><DialogTitle>{resource ? "Editar recurso" : "Crear recurso"}</DialogTitle><DialogDescription>Administración de Conocimiento</DialogDescription><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
    <div className="space-y-2 sm:col-span-2"><Label htmlFor="resource-title">Título *</Label><Input id="resource-title" name="title" required minLength={3} maxLength={160} defaultValue={resource?.title} onChange={e => { if (!resource) setSlug(slugify(e.target.value)); }} /></div>
    <div className="space-y-2 sm:col-span-2"><Label htmlFor="resource-slug">Dirección del recurso *</Label><Input id="resource-slug" value={slug} required maxLength={180} onChange={e => setSlug(e.target.value)} /></div>
    <div className="space-y-2 sm:col-span-2"><Label htmlFor="resource-description">Descripción *</Label><Textarea id="resource-description" name="description" required minLength={10} maxLength={600} defaultValue={resource?.description} rows={3} /></div>
    <div className="space-y-2"><Label htmlFor="resource-category">Categoría</Label><select id="resource-category" name="category" defaultValue={resource?.category ?? CATEGORIES[0]} className={inputClass}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
    <div className="space-y-2"><Label htmlFor="resource-type">Tipo de recurso</Label><select id="resource-type" value={type} onChange={e => { setType(e.target.value as ResourceInput["resource_type"]); setFile(""); }} className={inputClass}><option value="pdf">PDF</option><option value="video">Video</option><option value="other">Plantilla (XLSX, DOCX o CSV)</option></select></div>
    <div className="space-y-2"><Label htmlFor="resource-cover">Imagen de portada</Label><label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input p-3 text-center text-xs text-muted-foreground">{cover ? <FileCheck2 className="size-5 text-accent" /> : <Upload className="size-5" />}<span>{cover ? "Portada cargada · Sustituir" : "JPG, PNG o WebP · Máx. 5 MB"}</span><input id="resource-cover" type="file" accept="image/jpeg,image/png,image/webp" disabled={progress !== null || busy} onChange={e => upload(e, "cover")} className="w-full text-xs" /></label></div>
    <div className="space-y-2"><Label htmlFor="resource-file">{type === "video" ? "Archivo de video" : "Archivo del recurso"}</Label><label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input p-3 text-center text-xs text-muted-foreground">{file ? <FileCheck2 className="size-5 text-accent" /> : <Upload className="size-5" />}<span>{file ? "Archivo cargado · Sustituir" : `Máximo ${maxMb} MB`}</span><input id="resource-file" type="file" accept={type === "pdf" ? ".pdf" : type === "video" ? ".mp4,.webm" : ".xlsx,.docx,.csv"} disabled={progress !== null || busy} onChange={e => upload(e, type)} className="w-full text-xs" /></label></div>
    {progress !== null ? <div className="sm:col-span-2"><progress max={100} value={progress} className="h-2 w-full accent-accent" /><p role="status" className="text-xs text-muted-foreground">Cargando archivo… {progress}%</p></div> : null}
    {type === "video" ? <div className="space-y-2 sm:col-span-2"><Label htmlFor="resource-video">URL externa del video</Label><Input id="resource-video" name="video_url" type="url" maxLength={1000} placeholder="https://…" defaultValue={resource?.video_url ?? ""} /></div> : null}
    <div className="space-y-2"><Label htmlFor="resource-duration">Duración o tiempo de lectura</Label><Input id="resource-duration" name="duration" maxLength={60} placeholder="10 minutos" defaultValue={resource?.duration ?? ""} /></div>
    <div className="space-y-2"><Label htmlFor="resource-status">Estado</Label><select id="resource-status" name="status" defaultValue={resource?.status ?? "draft"} className={inputClass}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></div>
    <div className="space-y-2"><Label htmlFor="resource-date">Fecha de publicación</Label><Input id="resource-date" name="published_at" type="datetime-local" defaultValue={resource?.published_at ? new Date(Date.parse(resource.published_at) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""} /></div>
    <div className="space-y-2"><Label htmlFor="resource-button">Texto del botón de acceso</Label><Input id="resource-button" name="access_button_text" required minLength={3} maxLength={60} defaultValue={resource?.access_button_text ?? "Descargar mi recurso"} /></div>
    <label className="flex items-center gap-3 text-sm sm:col-span-2"><input type="checkbox" name="download_enabled" defaultChecked={resource?.download_enabled ?? type !== "video"} className="size-4 accent-accent" />Permitir descargar el archivo</label>
    {error ? <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p> : null}
    <div className="flex justify-end gap-3 border-t border-border pt-4 sm:col-span-2"><Button type="button" variant="outline" disabled={busy || progress !== null} onClick={onClose}>Cancelar</Button><Button type="submit" disabled={busy || progress !== null}>{busy ? <LoaderCircle className="animate-spin" /> : <Save />}{busy ? "Guardando…" : "Guardar recurso"}</Button></div>
  </form></DialogContent></Dialog>;
}