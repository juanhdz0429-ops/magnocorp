import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { FILE_MIME_TYPES, COVER_MIME_TYPES } from "./knowledge";

export function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("La conexión no está disponible.");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
}

export function browserStorageUrl(url: string) {
  const serverBase = process.env["SUPABASE_URL"];
  const browserBase = process.env["VITE_SUPABASE_URL"];
  return serverBase && browserBase && url.startsWith(serverBase) ? browserBase + url.slice(serverBase.length) : url;
}

export async function requireAdmin(client: SupabaseClient<Database>, userId: string) {
  const { data, error } = await client.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("No tienes autorización para administrar Conocimiento.");
}

export async function verifyStoredFile(client: SupabaseClient<Database>, bucket: string, path: string, type: "pdf" | "video" | "other" | "cover", maxMb: number) {
  const { data, error } = await client.storage.from(bucket).info(path);
  if (error || !data) throw new Error("El archivo no está disponible. Vuelve a cargarlo.");
  const allowed = type === "cover" ? COVER_MIME_TYPES : FILE_MIME_TYPES[type];
  if (!allowed.includes(data.contentType ?? "") || typeof data.size !== "number" || data.size > maxMb * 1024 * 1024) throw new Error("El formato o tamaño del archivo no está permitido.");
  if (type === "pdf") {
    const signed = await client.storage.from(bucket).createSignedUrl(path, 60);
    if (!signed.data) throw new Error("No se pudo comprobar el archivo.");
    const response = await fetch(signed.data.signedUrl, { headers: { Range: "bytes=0-7" } });
    if (!response.ok || !(await response.text()).startsWith("%PDF-")) throw new Error("El archivo no es un PDF válido.");
  }
}