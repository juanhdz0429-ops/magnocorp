import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
  empresa: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(255),
  telefono: z.string().trim().min(7).max(25),
  servicio: z.string().trim().min(2).max(80),
  mensaje: z.string().trim().min(10).max(1500),
  // Honeypot: must stay empty (basic spam protection).
  website: z.string().max(0).optional().default(""),
});

const LeadSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
  empresa: z.string().trim().max(120),
  email: z.string().trim().email().max(255),
  telefono: z.string().trim().min(7).max(25),
  giro: z.string().trim().max(120),
  empleados: z.string().trim().max(60),
  anios: z.string().trim().max(60),
  score: z.number().min(0).max(100),
  nivel: z.string().max(60),
  areas: z.array(z.object({ label: z.string().max(60), score: z.number() })).max(10),
});

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

async function sendEmail(subject: string, rows: Array<[string, string]>, replyTo?: string) {
  const resendKey = process.env["RESEND_API_KEY"];
  const to = process.env["LEADS_EMAIL_TO"] ?? "juan.hdz0429@gmail.com";
  const from = process.env["LEADS_EMAIL_FROM"] ?? "MagnoCorp <onboarding@resend.dev>";

  if (!resendKey) {
    console.info(`[lead] ${subject}`, Object.fromEntries(rows));
    return { delivered: false as const };
  }

  const html = `<h2 style="font-family:Arial,sans-serif">${escapeHtml(subject)}</h2>
<table style="font-family:Arial,sans-serif;border-collapse:collapse">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:6px 12px;border:1px solid #dbe3ec"><b>${escapeHtml(k)}</b></td><td style="padding:6px 12px;border:1px solid #dbe3ec">${escapeHtml(v)}</td></tr>`,
  )
  .join("")}
</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({ from, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Resend error [${res.status}]: ${body}`);
    return { delivered: false as const };
  }
  return { delivered: true as const };
}

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const, delivered: false };
    const { delivered } = await sendEmail(
      `Nueva solicitud desde magnocorp.com.mx — ${data.nombre}`,
      [
        ["Nombre", data.nombre],
        ["Empresa", data.empresa || "—"],
        ["Correo", data.email],
        ["Teléfono", data.telefono],
        ["Servicio de interés", data.servicio],
        ["Mensaje", data.mensaje],
      ],
      data.email,
    );
    return { ok: true as const, delivered };
  });

export const submitDiagnosticLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const { delivered } = await sendEmail(
      `Diagnóstico empresarial completado — ${data.empresa || data.nombre}`,
      [
        ["Nombre", data.nombre],
        ["Empresa", data.empresa],
        ["Correo", data.email],
        ["Teléfono", data.telefono],
        ["Giro", data.giro],
        ["Empleados", data.empleados],
        ["Años operando", data.anios],
        ["Score global", `${data.score}/100`],
        ["Nivel", data.nivel],
        ...data.areas.map(({ label, score }) => [label, `${score}/100`] as [string, string]),
      ],
      data.email,
    );
    return { ok: true as const, delivered };
  });
