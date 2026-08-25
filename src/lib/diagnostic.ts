export type AreaKey = "admin" | "comercial" | "marketing" | "ia" | "equipo";

export const AREAS: Record<AreaKey, { label: string; short: string }> = {
  admin: { label: "Procesos administrativos", short: "Administración" },
  comercial: { label: "Estrategia comercial y ventas", short: "Comercial" },
  marketing: { label: "Marketing digital", short: "Marketing" },
  ia: { label: "Inteligencia Artificial y tecnología", short: "IA y tecnología" },
  equipo: { label: "Equipo y desarrollo organizacional", short: "Equipo" },
};

export type Question = {
  id: number;
  area: AreaKey;
  text: string;
  /** Options ordered from best (100) to worst (0) unless `inverted`. */
  options: string[];
  /** When true, the first option is the least favourable answer. */
  inverted?: boolean;
};

const SCALE = ["Sí, todos", "La mayoría", "Algunos", "Muy pocos", "No"];
const FREQ = ["Siempre", "Frecuentemente", "A veces", "Casi nunca", "Nunca"];
const YESNO = ["Sí, de forma consolidada", "Sí, parcialmente", "Apenas iniciando", "Lo hemos considerado", "No"];
const OPPORTUNITY = [
  "No, ya están optimizadas",
  "Muy pocas",
  "Algunas",
  "Bastantes",
  "Sí, muchas",
];

export const QUESTIONS: Question[] = [
  { id: 1, area: "admin", text: "¿Tu empresa cuenta con procesos administrativos claramente definidos?", options: SCALE },
  { id: 2, area: "admin", text: "¿Los procesos importantes de tu empresa están documentados?", options: SCALE },
  { id: 3, area: "admin", text: "¿Utilizas indicadores para medir el desempeño del negocio?", options: FREQ },
  {
    id: 4,
    area: "admin",
    text: "¿Existen tareas administrativas que podrían automatizarse?",
    options: OPPORTUNITY,
  },

  { id: 5, area: "comercial", text: "¿Tu empresa cuenta con una estrategia comercial definida?", options: YESNO },
  { id: 6, area: "comercial", text: "¿Tienes metas de ventas claramente establecidas?", options: YESNO },
  {
    id: 7,
    area: "comercial",
    text: "¿Conoces cuáles son tus productos o servicios más rentables?",
    options: ["Sí, con datos precisos", "Sí, de forma aproximada", "Solo algunos", "Tengo dudas", "No lo sé"],
  },
  {
    id: 8,
    area: "comercial",
    text: "¿Utilizas algún sistema para dar seguimiento a tus prospectos y clientes?",
    options: ["Sí, un CRM en uso constante", "Sí, una herramienta digital básica", "Hojas de cálculo", "Registros informales", "No"],
  },

  { id: 9, area: "marketing", text: "¿Tu empresa tiene una estrategia de marketing digital?", options: YESNO },
  { id: 10, area: "marketing", text: "¿Publicas contenido de manera constante?", options: FREQ },
  {
    id: 11,
    area: "marketing",
    text: "¿Realizas campañas de publicidad digital?",
    options: ["Sí, de forma continua", "Con frecuencia", "Ocasionalmente", "Muy rara vez", "No"],
  },
  { id: 12, area: "marketing", text: "¿Mides los resultados de tus acciones de marketing?", options: FREQ },

  {
    id: 13,
    area: "ia",
    text: "¿Actualmente utilizas Inteligencia Artificial en tu empresa?",
    options: ["Sí, integrada a la operación", "Sí, en varias tareas", "En algunas tareas puntuales", "Solo pruebas aisladas", "No"],
  },
  { id: 14, area: "ia", text: "¿Utilizas IA para crear contenido o estrategias?", options: FREQ },
  {
    id: 15,
    area: "ia",
    text: "¿Existen procesos que podrían automatizarse mediante IA?",
    options: OPPORTUNITY,
  },
  {
    id: 16,
    area: "ia",
    text: "¿Tu empresa cuenta con herramientas digitales suficientes para operar eficientemente?",
    options: ["Sí, totalmente", "En su mayoría", "Parcialmente", "Muy limitadas", "No"],
  },

  { id: 17, area: "equipo", text: "¿Tu equipo tiene funciones y responsabilidades claramente definidas?", options: SCALE },
  { id: 18, area: "equipo", text: "¿Realizas capacitación periódica para tus colaboradores?", options: FREQ },
  {
    id: 19,
    area: "equipo",
    text: "¿Existen problemas de comunicación o coordinación dentro del equipo?",
    options: ["Sí, frecuentemente", "Con cierta frecuencia", "Ocasionalmente", "Muy pocas veces", "No"],
    inverted: true,
  },
  {
    id: 20,
    area: "equipo",
    text: "¿Consideras que tu equipo está preparado para acompañar el crecimiento de la empresa?",
    options: ["Sí, totalmente", "En gran medida", "Parcialmente", "Muy poco", "No"],
  },
];

/** Answer value = option index (0..4). */
export type Answers = Record<number, number>;

export type AreaScore = { key: AreaKey; label: string; score: number };

export type DiagnosticResult = {
  global: number;
  level: { name: string; range: string; description: string };
  areas: AreaScore[];
  strengths: AreaScore[];
  opportunities: AreaScore[];
  recommendations: string[];
};

function optionScore(q: Question, index: number) {
  const raw = (4 - index) * 25; // best option -> 100
  return q.inverted ? 100 - raw : raw;
}

const LEVELS = [
  {
    max: 39,
    name: "Nivel inicial",
    range: "0 – 39",
    description:
      "Tu empresa opera principalmente de forma reactiva. Existe una base sobre la cual construir, pero hace falta estructura, procesos y estrategia para crecer de manera ordenada.",
  },
  {
    max: 59,
    name: "Nivel básico",
    range: "40 – 59",
    description:
      "Tu empresa cuenta con elementos de estructura, aunque de manera desigual entre áreas. Formalizar procesos e indicadores permitiría dar el siguiente paso.",
  },
  {
    max: 79,
    name: "Nivel en desarrollo",
    range: "60 – 79",
    description:
      "Tu empresa tiene bases sólidas y prácticas consolidadas en varias áreas. El crecimiento vendrá de la optimización, la medición y la incorporación de tecnología.",
  },
  {
    max: 100,
    name: "Nivel avanzado",
    range: "80 – 100",
    description:
      "Tu empresa muestra madurez en estrategia, procesos y tecnología. El foco puede ponerse en escalar, innovar y sostener la mejora continua.",
  },
];

const AREA_RECOMMENDATIONS: Record<AreaKey, string> = {
  admin:
    "Tu empresa presenta una oportunidad importante para fortalecer y documentar sus procesos administrativos, definir indicadores de desempeño y comenzar una estrategia de automatización.",
  comercial:
    "Conviene formalizar la estrategia comercial: definir metas, estructurar el embudo de ventas y dar seguimiento sistemático a prospectos y clientes.",
  marketing:
    "El marketing digital puede pasar de la publicación esporádica a una estrategia con objetivos, calendario de contenidos, campañas y medición de resultados.",
  ia: "Existe un espacio relevante para incorporar Inteligencia Artificial y automatización en tareas repetitivas, atención a clientes y generación de contenido.",
  equipo:
    "Fortalecer la definición de funciones, la comunicación interna y la capacitación del equipo facilitará acompañar el crecimiento de la empresa.",
};

const AREA_STRENGTHS: Record<AreaKey, string> = {
  admin: "procesos administrativos ordenados",
  comercial: "una estructura comercial funcional",
  marketing: "presencia y estrategia digital activa",
  ia: "adopción tecnológica y uso de IA",
  equipo: "un equipo organizado y capacitado",
};

export function computeResult(answers: Answers): DiagnosticResult {
  const totals: Record<AreaKey, { sum: number; count: number }> = {
    admin: { sum: 0, count: 0 },
    comercial: { sum: 0, count: 0 },
    marketing: { sum: 0, count: 0 },
    ia: { sum: 0, count: 0 },
    equipo: { sum: 0, count: 0 },
  };

  for (const q of QUESTIONS) {
    const answer = answers[q.id];
    if (answer === undefined) continue;
    totals[q.area].sum += optionScore(q, answer);
    totals[q.area].count += 1;
  }

  const areas: AreaScore[] = (Object.keys(totals) as AreaKey[]).map((key) => ({
    key,
    label: AREAS[key].short,
    score: totals[key].count ? Math.round(totals[key].sum / totals[key].count) : 0,
  }));

  const global = Math.round(areas.reduce((acc, a) => acc + a.score, 0) / areas.length);
  const level = LEVELS.find((l) => global <= l.max) ?? LEVELS[LEVELS.length - 1]!;

  const sorted = [...areas].sort((a, b) => a.score - b.score);
  const opportunities = sorted.slice(0, 3);
  const strengths = [...areas].sort((a, b) => b.score - a.score).filter((a) => a.score >= 60).slice(0, 3);

  const recommendations = opportunities.map((a) => AREA_RECOMMENDATIONS[a.key]);
  if (strengths.length) {
    recommendations.unshift(
      `Tu empresa destaca por ${strengths.map((s) => AREA_STRENGTHS[s.key]).join(", ")}. Esa base puede aprovecharse para impulsar las áreas con menor puntuación.`,
    );
  }

  return { global, level, areas, strengths, opportunities, recommendations };
}
