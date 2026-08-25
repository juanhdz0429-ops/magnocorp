import { useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { AREAS, QUESTIONS, computeResult, type Answers } from "@/lib/diagnostic";
import { submitDiagnosticLead } from "@/lib/leads.functions";
import { waLink } from "@/lib/site-data";
import { Reveal } from "./Reveal";
import { CtaButton, CtaLink, SectionHeading } from "./ui";
import { cn } from "@/lib/utils";

type Stage = "intro" | "questions" | "result";

type Lead = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  giro: string;
  empleados: string;
  anios: string;
};

const EMPTY_LEAD: Lead = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  giro: "",
  empleados: "",
  anios: "",
};

const FIELDS: Array<{ name: keyof Lead; label: string; type?: string; options?: string[] }> = [
  { name: "nombre", label: "Nombre" },
  { name: "empresa", label: "Empresa" },
  { name: "email", label: "Correo electrónico", type: "email" },
  { name: "telefono", label: "Teléfono", type: "tel" },
  { name: "giro", label: "Giro" },
  {
    name: "empleados",
    label: "Número de empleados",
    options: ["1 a 5", "6 a 10", "11 a 30", "31 a 50", "Más de 50"],
  },
  {
    name: "anios",
    label: "Años operando",
    options: ["Menos de 1 año", "1 a 3 años", "4 a 10 años", "Más de 10 años"],
  },
];

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent";

export function Diagnostic() {
  const [stage, setStage] = useState<Stage>("intro");
  const [lead, setLead] = useState<Lead>(EMPTY_LEAD);
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({});
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [sending, setSending] = useState(false);

  const question = QUESTIONS[index];
  const progress = ((index + (answers[question?.id ?? 0] !== undefined ? 1 : 0)) / QUESTIONS.length) * 100;
  const result = useMemo(() => (stage === "result" ? computeResult(answers) : null), [stage, answers]);

  function validateLead() {
    const next: Partial<Record<keyof Lead, string>> = {};
    if (lead.nombre.trim().length < 2) next.nombre = "Escribe tu nombre.";
    if (lead.empresa.trim().length < 2) next.empresa = "Escribe el nombre de tu empresa.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email.trim())) next.email = "Correo electrónico no válido.";
    if (lead.telefono.replace(/\D/g, "").length < 10) next.telefono = "Teléfono de al menos 10 dígitos.";
    if (lead.giro.trim().length < 2) next.giro = "Indica el giro de tu empresa.";
    if (!lead.empleados) next.empleados = "Selecciona una opción.";
    if (!lead.anios) next.anios = "Selecciona una opción.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function start() {
    if (!validateLead()) return;
    setStage("questions");
    setIndex(0);
    setAnswers({});
  }

  function answer(optionIndex: number) {
    if (!question) return;
    const qid = question.id;
    setAnswers((prev) => ({ ...prev, [qid]: optionIndex }));
    window.setTimeout(() => {
      if (index < QUESTIONS.length - 1) setIndex((v) => v + 1);
      else void finish({ ...answers, [qid]: optionIndex });
    }, 220);
  }


  async function finish(finalAnswers: Answers) {
    const computed = computeResult(finalAnswers);
    setAnswers(finalAnswers);
    setStage("result");
    setSending(true);
    try {
      await submitDiagnosticLead({
        data: {
          ...lead,
          score: computed.global,
          nivel: computed.level.name,
          areas: computed.areas.map((a) => ({ label: a.label, score: a.score })),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setStage("intro");
    setAnswers({});
    setIndex(0);
  }

  return (
    <section id="diagnostico" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Diagnóstico empresarial"
          title="¿Qué necesita realmente tu empresa?"
          subtitle="Responde 20 preguntas y descubre las principales áreas de oportunidad de tu negocio."
        />

        <Reveal className="mt-12">
          <div className="card-elegant mx-auto max-w-4xl overflow-hidden">
            {stage === "intro" ? (
              <div className="p-7 sm:p-10">
                <h3 className="text-xl text-navy-deep">Antes de comenzar, cuéntanos sobre tu empresa</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Usamos estos datos únicamente para enviarte el resultado y darle seguimiento a tu diagnóstico.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {FIELDS.map((field) => (
                    <div key={field.name} className={field.name === "giro" ? "sm:col-span-2" : undefined}>
                      <label
                        htmlFor={`diag-${field.name}`}
                        className="mb-2 block font-display text-xs font-bold tracking-[0.08em] text-navy-deep uppercase"
                      >
                        {field.label}
                      </label>
                      {field.options ? (
                        <select
                          id={`diag-${field.name}`}
                          className={inputClass}
                          value={lead[field.name]}
                          onChange={(e) => setLead({ ...lead, [field.name]: e.target.value })}
                          aria-invalid={Boolean(errors[field.name])}
                        >
                          <option value="">Selecciona…</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={`diag-${field.name}`}
                          type={field.type ?? "text"}
                          className={inputClass}
                          value={lead[field.name]}
                          onChange={(e) => setLead({ ...lead, [field.name]: e.target.value })}
                          aria-invalid={Boolean(errors[field.name])}
                        />
                      )}
                      {errors[field.name] ? (
                        <p className="mt-1.5 text-xs text-destructive">{errors[field.name]}</p>
                      ) : null}
                    </div>
                  ))}
                </div>

                <CtaButton onClick={start} size="lg" className="mt-9 w-full sm:w-auto">
                  INICIAR DIAGNÓSTICO
                  <ArrowRight className="size-4" />
                </CtaButton>
              </div>
            ) : null}

            {stage === "questions" && question ? (
              <div className="p-7 sm:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="eyebrow">{AREAS[question.area].label}</p>
                  <p className="font-display text-sm font-bold text-navy-deep">
                    Pregunta {index + 1} de {QUESTIONS.length}
                  </p>
                </div>

                <div
                  className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary"
                  role="progressbar"
                  aria-valuenow={index + 1}
                  aria-valuemin={1}
                  aria-valuemax={QUESTIONS.length}
                  aria-label="Progreso del diagnóstico"
                >
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-accent)] transition-[width] duration-500"
                    style={{ width: `${Math.max(progress, 4)}%` }}
                  />
                </div>

                <fieldset className="mt-8">
                  <legend className="text-lg font-semibold text-navy-deep sm:text-xl">{question.text}</legend>
                  <div className="mt-6 grid gap-3">
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[question.id] === optionIndex;
                      return (
                        <label
                          key={option}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border px-5 py-4 text-sm font-medium transition-all duration-300",
                            selected
                              ? "border-accent bg-accent/8 text-navy-deep shadow-[var(--shadow-soft)]"
                              : "border-border bg-background text-foreground/85 hover:border-accent/50 hover:bg-secondary",
                          )}
                        >
                          <input
                            type="radio"
                            name={`q-${question.id}`}
                            className="size-4 accent-[oklch(0.6_0.178_258)]"
                            checked={selected}
                            onChange={() => answer(optionIndex)}
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-8 flex items-center justify-between">
                  <CtaButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIndex((v) => Math.max(0, v - 1))}
                    disabled={index === 0}
                  >
                    <ArrowLeft className="size-4" />
                    Anterior
                  </CtaButton>
                  <CtaButton
                    size="sm"
                    onClick={() => {
                      if (index < QUESTIONS.length - 1) setIndex((v) => v + 1);
                      else finish(answers);
                    }}
                    disabled={answers[question.id] === undefined}
                  >
                    {index === QUESTIONS.length - 1 ? "Ver resultado" : "Siguiente"}
                    <ArrowRight className="size-4" />
                  </CtaButton>
                </div>
              </div>
            ) : null}

            {stage === "result" && result ? (
              <div>
                <div className="surface-navy p-7 sm:p-10">
                  <p className="eyebrow text-[oklch(0.78_0.14_242)]">Resultado</p>
                  <h3 className="mt-3 text-2xl text-white sm:text-3xl">Este es el estado actual de tu empresa</h3>

                  <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                      <div className="flex items-end gap-3">
                        <span className="font-display text-6xl font-extrabold text-white">{result.global}</span>
                        <span className="pb-2 text-white/60">/ 100</span>
                      </div>
                      <p className="mt-3 inline-block rounded-full bg-white/12 px-4 py-1.5 font-display text-sm font-bold tracking-[0.1em] text-white uppercase">
                        {result.level.name} · {result.level.range}
                      </p>
                      <p className="mt-5 leading-relaxed text-white/70">{result.level.description}</p>
                      {sending ? (
                        <p className="mt-5 flex items-center gap-2 text-xs text-white/55">
                          <Loader2 className="size-3.5 animate-spin" /> Registrando tu diagnóstico…
                        </p>
                      ) : null}
                    </div>

                    <div className="h-72 w-full rounded-2xl border border-white/12 bg-white/5 p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={result.areas} outerRadius="72%">
                          <PolarGrid stroke="oklch(1 0 0 / 0.18)" />
                          <PolarAngleAxis
                            dataKey="label"
                            tick={{ fill: "oklch(1 0 0 / 0.75)", fontSize: 11 }}
                          />
                          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            dataKey="score"
                            stroke="oklch(0.78 0.14 242)"
                            fill="oklch(0.6 0.178 258)"
                            fillOpacity={0.45}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="p-7 sm:p-10">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                      <h4 className="font-display text-sm font-extrabold tracking-[0.12em] text-navy-deep uppercase">
                        Resultados por área
                      </h4>
                      <ul className="mt-5 space-y-4">
                        {result.areas.map((area) => (
                          <li key={area.key}>
                            <div className="flex items-center justify-between text-sm font-semibold text-navy-deep">
                              <span>{area.label}</span>
                              <span>{area.score}</span>
                            </div>
                            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-[image:var(--gradient-accent)]"
                                style={{ width: `${area.score}%` }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>

                      {result.strengths.length ? (
                        <>
                          <h4 className="mt-8 font-display text-sm font-extrabold tracking-[0.12em] text-navy-deep uppercase">
                            Áreas fuertes
                          </h4>
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {result.strengths.map((area) => (
                              <li
                                key={area.key}
                                className="rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-semibold text-navy-deep"
                              >
                                {area.label} · {area.score}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>

                    <div>
                      <h4 className="font-display text-sm font-extrabold tracking-[0.12em] text-navy-deep uppercase">
                        Principales áreas de oportunidad
                      </h4>
                      <ol className="mt-4 space-y-2">
                        {result.opportunities.map((area, i) => (
                          <li key={area.key} className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
                            <span className="font-display text-lg font-extrabold text-accent">{i + 1}</span>
                            <span className="text-sm font-semibold text-navy-deep">{AREAS[area.key].label}</span>
                            <span className="ml-auto text-sm text-muted-foreground">{area.score}/100</span>
                          </li>
                        ))}
                      </ol>

                      <h4 className="mt-8 font-display text-sm font-extrabold tracking-[0.12em] text-navy-deep uppercase">
                        Recomendaciones
                      </h4>
                      <ul className="mt-3 space-y-3">
                        {result.recommendations.map((rec) => (
                          <li key={rec} className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-foreground/80">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 rounded-2xl bg-secondary p-7 text-center">
                    <p className="mx-auto max-w-2xl font-display text-lg font-extrabold text-navy-deep sm:text-xl">
                      Tu empresa tiene oportunidades de crecimiento. Ahora podemos ayudarte a convertirlas en
                      resultados.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <CtaLink href="#contacto">QUIERO MEJORAR MI EMPRESA</CtaLink>
                      <CtaLink href="#contacto" variant="outline">
                        HABLAR CON UN CONSULTOR
                      </CtaLink>
                      <CtaLink
                        variant="whatsapp"
                        href={waLink(
                          "Hola MagnoCorp, acabo de realizar el diagnóstico empresarial y me gustaría conocer cómo pueden ayudarme.",
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        CONTACTAR POR WHATSAPP
                      </CtaLink>
                    </div>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-navy-deep hover:underline"
                    >
                      <RotateCcw className="size-3.5" /> Realizar el diagnóstico nuevamente
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
