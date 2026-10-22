import { useState, useRef, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Download, CheckCircle2, Play, LoaderCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { accessSchema, type PublicResource, type AccessResult } from "@/lib/knowledge";
import { requestResourceAccess } from "@/lib/knowledge.functions";

export function ResourceAccess({ resource, privacy, onClose }: { resource: PublicResource | null; privacy: { privacy_notice_url: string | null; privacy_notice_version: string } | null; onClose: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AccessResult | null>(null);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const submit = useServerFn(requestResourceAccess);
  const expired = result?.ok && Date.parse(result.expires_at) < Date.now();
  const ready = Boolean(privacy?.privacy_notice_url && privacy.privacy_notice_version !== "pending");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resource || locked.current) return;
    const fd = new FormData(event.currentTarget);
    const validated = accessSchema.safeParse({ resource_id: resource.id, full_name: fd.get("full_name"), email: fd.get("email"), phone: fd.get("phone"), marketing_consent: fd.get("marketing_consent") === "on", website: fd.get("website") });
    if (!validated.success) { setErrors(Object.fromEntries(validated.error.issues.map(i => [String(i.path[0]), i.message]))); return; }
    locked.current = true; setBusy(true); setErrors({});
    try { const response = await submit({ data: validated.data }); setResult(response); if (!response.ok) setErrors({ form: response.error }); }
    catch { setErrors({ form: "No pudimos guardar tu solicitud. Revisa tu conexión y vuelve a intentarlo." }); }
    finally { locked.current = false; setBusy(false); }
  }
  return <Dialog open={Boolean(resource)} onOpenChange={open => { if (!open && !busy) { onClose(); setResult(null); setErrors({}); } }}>
    <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg border-border bg-background shadow-[var(--shadow-lift)]">
      <DialogTitle className="pr-7 text-xl leading-snug text-primary">{result?.ok ? "¡Listo! Tu recurso está preparado." : resource?.title}</DialogTitle>
      <DialogDescription>{result?.ok ? "Gracias por tu interés en aprender con MagnoCorp. Ya puedes acceder al material que seleccionaste." : resource?.description}</DialogDescription>
      {result?.ok && !expired ? <div className="space-y-5">
        <CheckCircle2 className="size-10 text-accent" />
        <p className="font-semibold">{resource?.title}</p>
        {result.mode === "video" && result.url.includes("/storage/") ? <video src={result.url} controls controlsList={result.download_url ? undefined : "nodownload"} className="aspect-video w-full rounded-md bg-navy-ink" /> : null}
        <Button asChild className="h-auto min-h-11 w-full whitespace-normal"><a href={result.mode === "file" ? result.download_url ?? result.url : result.url} target="_blank" rel="noopener noreferrer">{result.mode === "video" ? <Play /> : <Download />}{result.mode === "video" ? "Ver video en línea" : resource?.access_button_text ?? "Descargar mi recurso"}</a></Button>
        {result.mode === "video" && result.download_url ? <Button asChild variant="outline" className="w-full"><a href={result.download_url} target="_blank" rel="noopener noreferrer"><Download />Descargar video</a></Button> : null}
        <div className="border-t border-border pt-5"><h3 className="text-base">¿Quieres llevar tu negocio al siguiente nivel?</h3><p className="mt-2 text-sm text-muted-foreground">Descubre cómo MagnoCorp puede ayudarte a aplicar inteligencia artificial, marketing digital e innovación en tu empresa.</p><Button asChild variant="link" className="mt-2 px-0"><Link to="/" hash="servicios">Conoce nuestros servicios<ArrowRight /></Link></Button></div>
      </div> : <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <p className="text-sm">Obtén este recurso gratuito y comienza a aplicar nuevas ideas en tu negocio.</p>
        {expired ? <p className="text-sm text-destructive">El enlace caducó. Solicita el recurso nuevamente.</p> : null}
        {([['full_name', 'Nombre completo *', 'text'], ['email', 'Correo electrónico *', 'email'], ['phone', 'Número de teléfono (opcional)', 'tel']] as const).map(([name, label, type]) => <div key={name} className="space-y-2"><Label htmlFor={`access-${name}`}>{label}</Label><Input id={`access-${name}`} name={name} type={type} autoComplete={name === "full_name" ? "name" : type} maxLength={name === "full_name" ? 100 : name === "email" ? 255 : 30} required={name !== "phone"} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} placeholder={name === "phone" ? "+52 669 000 0000" : undefined} />{errors[name] ? <p id={`${name}-error`} className="text-sm text-destructive">{errors[name]}</p> : null}</div>)}
        <div className="hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></div>
        <label className="flex items-start gap-3 text-sm text-muted-foreground"><input type="checkbox" name="marketing_consent" className="mt-1 size-4 accent-accent" />Deseo recibir por correo electrónico novedades y comunicaciones comerciales de MagnoCorp. Esta autorización es opcional.</label>
        {!ready ? <p className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">El acceso estará disponible cuando MagnoCorp publique su aviso de privacidad.</p> : null}
        {errors["form"] ? <p role="alert" className="text-sm text-destructive">{errors["form"]}</p> : null}
        <Button type="submit" disabled={busy || !ready} className="min-h-11 w-full">{busy ? <LoaderCircle className="animate-spin" /> : <Download />}{busy ? "Guardando solicitud…" : "Descargar gratis"}</Button>
        <p className="text-xs leading-relaxed text-muted-foreground">Utilizaremos tus datos para gestionar el acceso al recurso solicitado y atender las finalidades que se expliquen en nuestro aviso de privacidad. {privacy?.privacy_notice_url ? <a className="text-primary underline" href={privacy.privacy_notice_url} target="_blank" rel="noopener noreferrer">Aviso de privacidad</a> : null}</p>
      </form>}
    </DialogContent>
  </Dialog>;
}