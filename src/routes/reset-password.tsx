import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRecoverySession } from "@/lib/auth-recovery";
import { z } from "zod";
export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Restablecer contraseña | MagnoCorp" }, { name: "description", content: "Restablece la contraseña de tu cuenta MagnoCorp." }, { property: "og:title", content: "Restablecer contraseña | MagnoCorp" }, { property: "og:description", content: "Recuperación segura del acceso a MagnoCorp." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ResetPassword,
});
function ResetPassword() {
  const recoverySession = useRecoverySession();
  const [ready, setReady] = useState(false); const [error, setError] = useState(""); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);
  useEffect(() => { const recovery = recoverySession || new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery"; if (recovery) supabase.auth.getUser().then(({ data }) => setReady(Boolean(data.user))); }, [recoverySession]);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (busy || !ready) return; const fd = new FormData(e.currentTarget); const password = z.string().min(8).max(128).safeParse(fd.get("password")); if (!password.success || password.data !== fd.get("confirmation")) { setError("Las contraseñas deben coincidir y tener al menos 8 caracteres."); return; } setBusy(true); setError(""); try { const r = await supabase.auth.updateUser({ password: password.data }); if (r.error) throw r.error; setDone(true); } catch { setError("No pudimos cambiar la contraseña. Solicita otro enlace de recuperación."); } finally { setBusy(false); } }
  return <main className="container-page max-w-lg py-20"><h1 className="text-3xl text-primary">Restablecer contraseña</h1>{done ? <p className="mt-5">Tu contraseña fue actualizada.</p> : !ready ? <p className="mt-5 text-muted-foreground">Abre el enlace de recuperación enviado a tu correo. Si caducó, solicita uno nuevo.</p> : <form onSubmit={submit} className="mt-8 space-y-5"><Label htmlFor="reset-password">Nueva contraseña</Label><Input id="reset-password" name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" /><Label htmlFor="reset-confirm">Confirmar contraseña</Label><Input id="reset-confirm" name="confirmation" type="password" required minLength={8} maxLength={128} autoComplete="new-password" />{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}<Button disabled={busy} type="submit">Guardar contraseña</Button></form>}<Button variant="link" asChild className="mt-5 px-0"><Link to="/auth">Volver al acceso</Link></Button></main>;
}