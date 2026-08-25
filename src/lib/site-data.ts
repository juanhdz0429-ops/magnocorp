export const WHATSAPP_NUMBER = "526699326296";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const CONTACT = {
  phoneDisplay: "669 932 6296",
  phoneHref: "tel:+526699326296",
  email: "juan.hdz0429@gmail.com",
  website: "www.magnocorp.com.mx",
  location: "Mazatlán, Sinaloa, México",
  facebook: "MagnoCorp MZT",
};

export const NAV_LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "servicios", label: "Servicios" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "proyectos", label: "Proyectos" },
  { id: "blog", label: "Blog" },
  { id: "magnoia", label: "MagnoIA" },
  { id: "contacto", label: "Contacto" },
];

export type Service = {
  id: string;
  title: string;
  intro?: string;
  items: string[];
  cta: string;
  icon: string;
};

export const SERVICES: Service[] = [
  {
    id: "consultoria",
    title: "Consultoría empresarial",
    items: [
      "Planeación estratégica",
      "Organización empresarial",
      "Desarrollo organizacional",
      "Modelos de negocio",
      "Indicadores",
      "Procesos",
    ],
    cta: "Quiero asesoría",
    icon: "Compass",
  },
  {
    id: "comercial",
    title: "Desarrollo comercial",
    items: [
      "Estrategias comerciales",
      "Planeación de ventas",
      "Desarrollo de canales",
      "Fidelización",
      "Embudos de conversión",
      "Análisis comercial",
    ],
    cta: "Quiero mejorar mis ventas",
    icon: "TrendingUp",
  },
  {
    id: "marketing",
    title: "Marketing digital",
    items: [
      "Estrategia digital",
      "Redes sociales",
      "Publicidad digital",
      "Branding",
      "Contenido",
      "Campañas digitales",
    ],
    cta: "Quiero mejorar mi marketing",
    icon: "Megaphone",
  },
  {
    id: "ia",
    title: "Inteligencia Artificial",
    items: [
      "IA para marketing",
      "IA para ventas",
      "Automatización",
      "Chatbots",
      "Agentes IA",
      "Productividad empresarial",
    ],
    cta: "Quiero implementar IA",
    icon: "Cpu",
  },
  {
    id: "procesos",
    title: "Procesos administrativos",
    items: [
      "Diagnóstico",
      "Estandarización",
      "Manuales",
      "Optimización",
      "Automatización",
      "Indicadores",
    ],
    cta: "Optimizar mis procesos",
    icon: "Workflow",
  },
  {
    id: "equipos",
    title: "Desarrollo de equipos",
    items: [
      "Integración",
      "Capacitación",
      "Liderazgo",
      "Comunicación",
      "Productividad",
      "Cultura organizacional",
    ],
    cta: "Fortalecer mi equipo",
    icon: "Users",
  },
  {
    id: "capacitacion",
    title: "Capacitación empresarial",
    intro: "Cursos y talleres sobre:",
    items: [
      "Marketing digital",
      "Inteligencia Artificial",
      "Ventas",
      "Administración",
      "Finanzas",
      "Emprendimiento",
      "Innovación",
    ],
    cta: "Solicitar capacitación",
    icon: "GraduationCap",
  },
];

export const METHODOLOGY = [
  { n: "01", title: "Diagnosticar", text: "Identificamos la situación actual." },
  { n: "02", title: "Estrategizar", text: "Diseñamos una solución." },
  { n: "03", title: "Implementar", text: "Convertimos la estrategia en acciones." },
  { n: "04", title: "Medir", text: "Analizamos resultados." },
  { n: "05", title: "Mejorar", text: "Optimizamos continuamente." },
];

export const VALUES = [
  "Profesionalismo",
  "Innovación",
  "Compromiso",
  "Honestidad",
  "Orientación a resultados",
  "Trabajo en equipo",
  "Mejora continua",
  "Cercanía con el cliente",
];

export const CLIENTS = [
  "FRAICHE",
  "GNP",
  "OSAKO",
  "TACO MACHO",
  "RE/MAX",
  "ABIRA",
  "VALPE",
  "FORTEmx",
  "TYTYS Marisquería",
  "Maíz y Brasa Taquería",
  "Marval Vinos y Licores",
  "CANACO",
];

export const PROJECT_CASES = [
  {
    area: "Desarrollo comercial",
    sector: "Sector privado",
    text: "Acompañamiento en la definición de estrategias comerciales, estructura de ventas y seguimiento de prospectos.",
  },
  {
    area: "Marketing digital",
    sector: "Comercio y servicios",
    text: "Diseño de estrategia digital, contenidos y campañas orientadas a generar demanda para el negocio.",
  },
  {
    area: "Capacitación empresarial",
    sector: "Organismos empresariales",
    text: "Impartición de cursos y talleres en marketing digital, ventas, administración e Inteligencia Artificial.",
  },
  {
    area: "Transformación digital",
    sector: "PyMES",
    text: "Incorporación de herramientas digitales para ordenar la operación diaria y facilitar la toma de decisiones.",
  },
  {
    area: "Inteligencia Artificial",
    sector: "Sector privado",
    text: "Identificación de casos de uso de IA y automatización aplicables a marketing, ventas y productividad.",
  },
  {
    area: "Procesos administrativos",
    sector: "Sector público y privado",
    text: "Revisión, estandarización y documentación de procesos administrativos clave.",
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ia-en-pymes",
    title: "5 formas de utilizar Inteligencia Artificial en una PyME",
    category: "Inteligencia Artificial",
    date: "2026-01-15",
    excerpt:
      "La IA no es exclusiva de las grandes corporaciones. Estas son cinco aplicaciones prácticas que una pequeña o mediana empresa puede implementar hoy.",
    body: [
      "La Inteligencia Artificial dejó de ser una promesa lejana para convertirse en una herramienta de trabajo cotidiana. En una PyME, su valor no está en la sofisticación tecnológica sino en la capacidad de liberar tiempo y mejorar decisiones.",
      "1. Generación y planeación de contenido para redes sociales y campañas. 2. Atención a clientes mediante asistentes conversacionales. 3. Análisis de información comercial para identificar productos y clientes más rentables. 4. Automatización de tareas administrativas repetitivas. 5. Apoyo en la elaboración de propuestas, cotizaciones y documentos comerciales.",
      "El punto de partida recomendado es siempre el mismo: identificar dónde se pierde más tiempo dentro de la operación y comenzar por ahí, con un caso de uso pequeño y medible.",
    ],
  },
  {
    slug: "procesos-administrativos",
    title: "Cómo mejorar los procesos administrativos de una empresa",
    category: "Procesos",
    date: "2026-01-29",
    excerpt:
      "Documentar, estandarizar y medir. Tres pasos que ordenan la operación y reducen los errores del día a día.",
    body: [
      "Un proceso administrativo desordenado no siempre se nota en los estados financieros, pero sí en el tiempo del equipo, en los reprocesos y en la calidad del servicio.",
      "Mejorar procesos comienza por describir cómo se hacen hoy las cosas, no cómo deberían hacerse. A partir de ese mapa se identifican pasos innecesarios, duplicidades y puntos de riesgo.",
      "El siguiente paso es estandarizar: definir responsables, tiempos y formatos. Finalmente, se establecen indicadores simples que permitan verificar si el proceso funciona.",
    ],
  },
  {
    slug: "estrategia-comercial",
    title: "Cómo desarrollar una estrategia comercial",
    category: "Desarrollo comercial",
    date: "2026-02-10",
    excerpt:
      "Una estrategia comercial no es una lista de metas: es la definición clara de a quién le vendes, qué le vendes y cómo lo vendes.",
    body: [
      "Toda estrategia comercial parte de tres definiciones: el mercado objetivo, la propuesta de valor y el modelo de comercialización.",
      "Con esas definiciones se construye el embudo: cómo se generan prospectos, cómo se les da seguimiento y cómo se cierran las oportunidades.",
      "Por último, la estrategia necesita indicadores. Sin métricas de prospección, conversión y ticket promedio no es posible saber qué está funcionando.",
    ],
  },
  {
    slug: "marketing-que-genera-resultados",
    title: "Marketing Digital: de publicar a generar resultados",
    category: "Marketing digital",
    date: "2026-02-24",
    excerpt:
      "Publicar constantemente no es una estrategia. Estos son los elementos que convierten la presencia digital en oportunidades comerciales.",
    body: [
      "Muchas empresas confunden actividad con estrategia. Publicar todos los días sin un objetivo definido genera trabajo, no resultados.",
      "Una estrategia digital efectiva define objetivos comerciales, audiencias, mensajes y canales, y conecta cada pieza de contenido con una etapa del proceso de compra.",
      "La medición cierra el ciclo: alcance y interacciones son señales, pero los indicadores relevantes son prospectos, costo por prospecto y ventas atribuibles.",
    ],
  },
  {
    slug: "automatizar-con-ia",
    title: "Cómo automatizar tareas repetitivas con IA",
    category: "Automatización",
    date: "2026-03-09",
    excerpt:
      "Identifica las tareas que consumen tiempo sin aportar valor y conviértelas en flujos automáticos.",
    body: [
      "La automatización comienza con un inventario de tareas: qué se hace, con qué frecuencia y cuánto tiempo consume.",
      "Las mejores candidatas son tareas repetitivas, con reglas claras y bajo nivel de criterio: captura de información, respuestas frecuentes, reportes periódicos y seguimientos.",
      "La recomendación es automatizar por etapas, validando cada flujo antes de escalarlo al resto de la operación.",
    ],
  },
  {
    slug: "preparada-para-ia",
    title: "¿Tu empresa está preparada para implementar Inteligencia Artificial?",
    category: "Inteligencia Artificial",
    date: "2026-03-23",
    excerpt:
      "Antes de adoptar IA conviene revisar procesos, información y equipo. Esta es una guía de autoevaluación.",
    body: [
      "La IA amplifica lo que ya existe. Si los procesos están desordenados, la tecnología multiplica el desorden.",
      "Tres condiciones facilitan una implementación exitosa: procesos definidos, información disponible y un equipo dispuesto a incorporar nuevas herramientas.",
      "El diagnóstico empresarial de MagnoCorp permite ubicar el punto de partida de cada empresa en estas dimensiones.",
    ],
  },
  {
    slug: "errores-que-frenan-pymes",
    title: "Errores que frenan el crecimiento de las PyMES",
    category: "Consultoría",
    date: "2026-04-06",
    excerpt:
      "Falta de estructura, ausencia de indicadores y decisiones basadas en intuición: patrones frecuentes en empresas que se estancan.",
    body: [
      "El crecimiento de una empresa rara vez se detiene por una sola causa. Suele ser la combinación de estructura insuficiente, procesos informales y falta de información para decidir.",
      "Otro patrón frecuente es la concentración de decisiones en una sola persona, lo que limita la capacidad de la organización para escalar.",
      "Reconocer estos patrones a tiempo permite corregir el rumbo antes de que el problema se vuelva estructural.",
    ],
  },
  {
    slug: "indicadores-para-decidir",
    title: "Cómo utilizar indicadores para tomar mejores decisiones",
    category: "Consultoría",
    date: "2026-04-20",
    excerpt:
      "Pocos indicadores, bien elegidos y revisados con disciplina, valen más que un tablero lleno de datos.",
    body: [
      "Un indicador útil responde una pregunta concreta del negocio y tiene un responsable que puede actuar sobre él.",
      "Conviene comenzar con un conjunto reducido: ventas, margen, prospectos, conversión y productividad. A partir de ahí se profundiza por área.",
      "La disciplina de revisión periódica es lo que convierte a los indicadores en una herramienta de gestión y no en un reporte más.",
    ],
  },
];
