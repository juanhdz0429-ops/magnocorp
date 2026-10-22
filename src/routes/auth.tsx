import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { LogIn, LoaderCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/magnocorp-logo.png.asset.json";
export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Acceso del equipo | MagnoCorp" }, { name: "description", content: "Acceso privado a la administración de Conocimiento de MagnoCorp." }, { property: "og:title", content: "Acceso del equipo | MagnoCorp" }, { property: "og:description", content: "Ingresa a la administración de MagnoCorp." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AuthPage,
});
function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login"); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const navigate = useNavigate();
  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/admin/conocimiento", replace: true }); }); }, [navigate]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const fd = new FormData(event.currentTarget); const email = z.string().trim().email().max(255).safeParse(fd.get("email")); const password = z.string().min(mode === "signup" ? 8 : 1).max(128).safeParse(fd.get("password"));
    if (!email.success || (mode !== "reset" && !password.success)) { setError("Escribe un correo válido y una contraseña de al menos 8 caracteres para crear tu cuenta."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      if (mode === "reset") { const r = await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: `${window.location.origin}/reset-password` }); if (r.error) throw r.error; setMessage("Si existe una cuenta con ese correo, recibirás un enlace para cambiar tu contraseña."); }
      else if (password.success && mode === "signup") { const r = await supabase.auth.signUp({ email: email.data, password: password.data, options: { emailRedirectTo: `${window.location.origin}/auth` } }); if (r.error) throw r.error; if (r.data.session) await navigate({ to: "/admin/conocimiento" }); else setMessage("Revisa tu correo para confirmar tu cuenta. Crear una cuenta no concede acceso de administrador."); }
      else if (password.success) { const r = await supabase.auth.signInWithPassword({ email: email.data, password: password.data }); if (r.error) throw r.error; await navigate({ to: "/admin/conocimiento", replace: true }); }
    } catch { setError(mode === "login" ? "No pudimos iniciar sesión. Revisa tus datos y confirma tu correo." : "No se pudo procesar la solicitud. Inténtalo nuevamente."); }
    finally { setBusy(false); }
  }
  async function social(provider: "google" | "lovable") { setBusy(true); setError(""); try { const r = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth` }); if (r.error) throw r.error; if (!r.redirected) await navigate({ to: "/admin/conocimiento", replace: true }); } catch { setError("No pudimos iniciar sesión. Inténtalo nuevamente."); } finally { setBusy(false); } }
  return <main className="flex min-h-screen items-center justify-center bg-secondary px-5 py-12"><div className="w-full max-w-md"><Link to="/conocimiento"><img src={logo.url} alt="MagnoCorp" width={1920} height={592} className="mb-10 h-12 w-auto max-w-full" /></Link><p className="mb-3 text-xs font-bold uppercase text-accent">Administración de Conocimiento</p><h1 className="text-3xl leading-tight text-primary">{mode === "login" ? "Acceso del equipo" : mode === "signup" ? "Crear cuenta" : "Recuperar contraseña"}</h1><form onSubmit={submit} className="mt-8 space-y-5"><div className="space-y-2"><Label htmlFor="auth-email">Correo electrónico</Label><Input id="auth-email" name="email" type="email" required maxLength={255} autoComplete="email" className="h-11 bg-background" /></div>{mode !== "reset" ? <div className="space-y-2"><Label htmlFor="auth-password">Contraseña</Label><Input id="auth-password" name="password" type="password" required minLength={mode === "signup" ? 8 : 1} maxLength={128} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="h-11 bg-background" /></div> : null}{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}{message ? <p role="status" className="text-sm text-primary">{message}</p> : null}<Button type="submit" className="h-11 w-full" disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <LogIn />}{mode === "login" ? "Iniciar sesión" : mode === "signup" ? "Crear cuenta" : "Enviar enlace"}</Button></form>{mode !== "reset" ? <div className="mt-5 space-y-3"><Button className="h-11 w-full" variant="outline" disabled={busy} onClick={() => social("google")}>Continuar con Google</Button><Button className="lovable-auth-button w-full" disabled={busy} onClick={() => social("lovable")}>Continue with Lovable</Button></div> : null}<div className="mt-5 flex flex-wrap justify-between gap-2"><Button variant="link" size="sm" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); setMessage(""); }}>{mode === "signup" ? "Ya tengo una cuenta" : "Crear cuenta"}</Button><Button variant="link" size="sm" onClick={() => { setMode(mode === "reset" ? "login" : "reset"); setError(""); setMessage(""); }}>{mode === "reset" ? "Volver al acceso" : "Olvidé mi contraseña"}</Button></div><Button variant="link" asChild className="mt-8 px-0"><Link to="/conocimiento"><ArrowLeft />Volver a Conocimiento</Link></Button></div></main>;
}