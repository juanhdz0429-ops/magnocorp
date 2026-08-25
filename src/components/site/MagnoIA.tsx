import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Send, User } from "lucide-react";
import { askMagnoIA } from "@/lib/magnoia.functions";
import { waLink } from "@/lib/site-data";
import { Reveal } from "./Reveal";
import { CtaLink, SectionHeading } from "./ui";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "¿Cómo puedo aumentar mis ventas?",
  "¿Cómo puedo utilizar IA en mi empresa?",
  "¿Qué estrategia de marketing debería utilizar?",
  "¿Qué procesos puedo automatizar?",
  "¿Cómo puedo mejorar la productividad de mi equipo?",
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hola, soy MagnoIA, el asistente empresarial de MagnoCorp. Cuéntame sobre tu negocio y te ayudo con estrategia, marketing, ventas, procesos o Inteligencia Artificial.",
};

export function MagnoIA() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const clean = text.trim().slice(0, 1000);
    if (!clean || loading) return;
    const next = [...messages, { role: "user" as const, content: clean }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await askMagnoIA({
        data: { messages: next.filter((m) => m !== WELCOME).slice(-16) },
      });
      setMessages([
        ...next,
        { role: "assistant", content: res.ok ? res.content : res.error },
      ]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...next,
        { role: "assistant", content: "No pudimos conectar con MagnoIA. Intenta nuevamente en unos momentos." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <section id="magnoia" className="surface-navy relative overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.6_0.178_258/0.22),transparent_65%)] blur-2xl"
      />
      <div className="container-page relative">
        <SectionHeading
          light
          eyebrow="Asistente inteligente"
          title="MagnoIA"
          subtitle="Tu asistente inteligente para el desarrollo empresarial."
        />
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/60">
          MagnoIA es el asistente virtual de MagnoCorp diseñado para responder preguntas relacionadas exclusivamente
          con negocios, estrategia, marketing, ventas, innovación e Inteligencia Artificial.
        </p>

        <Reveal className="mt-12">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-navy-ink/70 shadow-[0_40px_90px_-45px_oklch(0_0_0/0.9)] backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[image:var(--gradient-accent)] text-primary-foreground">
                <Bot className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm font-extrabold text-white">MagnoIA</p>
                <p className="text-xs text-white/50">Asistente empresarial de MagnoCorp</p>
              </div>
            </div>

            <div
              ref={listRef}
              className="h-[26rem] space-y-4 overflow-y-auto px-5 py-6"
              role="log"
              aria-live="polite"
              aria-label="Conversación con MagnoIA"
            >
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
                      message.role === "user" ? "bg-white/10 text-white/80" : "bg-accent/25 text-white",
                    )}
                  >
                    {message.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                  </span>
                  <p
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                      message.role === "user"
                        ? "bg-white text-navy-deep"
                        : "border border-white/10 bg-white/8 text-white/85",
                    )}
                  >
                    {message.content}
                  </p>
                </div>
              ))}

              {loading ? (
                <div className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/25 text-white"
                  >
                    <Bot className="size-4" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/8 px-4 py-4">
                    <span className="sr-only">MagnoIA está escribiendo</span>
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="size-1.5 rounded-full bg-white/70"
                        style={{ animation: `magno-dot 1.2s ${d * 0.15}s infinite ease-in-out` }}
                      />
                    ))}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/10 px-5 py-4">
              <ul className="mb-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => void send(suggestion)}
                      disabled={loading}
                      className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/75 transition-colors hover:bg-white/12 hover:text-white disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>

              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <label htmlFor="magnoia-input" className="sr-only">
                  Escribe tu pregunta para MagnoIA
                </label>
                <input
                  id="magnoia-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={1000}
                  placeholder="Escribe tu pregunta sobre tu empresa…"
                  className="flex-1 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Enviar mensaje"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[image:var(--gradient-accent)] text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
                >
                  <Send className="size-4.5" />
                </button>
              </form>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/12 bg-white/5 p-8 text-center">
          <h3 className="text-2xl text-white">¿Quieres tu propio ChatBot?</h3>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-white/65">
            Podemos desarrollar un asistente inteligente personalizado para tu empresa, capacitado con la información,
            productos, servicios y procesos de tu negocio.
          </p>
          <CtaLink
            href={waLink("Hola MagnoCorp, me interesa desarrollar mi propio ChatBot empresarial.")}
            target="_blank"
            rel="noopener noreferrer"
            variant="solidLight"
            size="lg"
            className="mt-7"
          >
            CONTÁCTANOS
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}
