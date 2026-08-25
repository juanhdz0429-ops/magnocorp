# MagnoCorp — Sitio web corporativo

Sitio corporativo de **MagnoCorp** (Consultoría Empresarial · Marketing Digital · Inteligencia Artificial · Desarrollo Empresarial), con diagnóstico empresarial interactivo, asistente MagnoIA y formulario de contacto funcional.

## Tecnologías

- TanStack Start (React 19 + TanStack Router) sobre Vite
- Tailwind CSS v4 con sistema de diseño en `src/styles.css` (tokens `oklch`)
- Recharts (gráfico radar del diagnóstico)
- lucide-react (iconografía)
- Zod (validación en servidor)
- Server functions de TanStack para MagnoIA y el envío de formularios

## Cómo ejecutar

```bash
bun install
bun run dev      # http://localhost:8080
bun run build    # build de producción
```

## Cómo desplegar

El proyecto se publica desde Lovable (botón **Publish**). El build genera un bundle SSR compatible con el runtime serverless de la plataforma.

## Variables de entorno

Se configuran como *secrets* del proyecto (nunca en el código):

| Variable | Uso | Obligatoria |
|---|---|---|
| `LOVABLE_API_KEY` | Acceso al gateway de IA que impulsa MagnoIA (se genera automáticamente) | Sí, para MagnoIA |
| `RESEND_API_KEY` | Envío real de correos del formulario y del diagnóstico | Recomendada |
| `LEADS_EMAIL_TO` | Destinatario de los prospectos (por defecto `juan.hdz0429@gmail.com`) | No |
| `LEADS_EMAIL_FROM` | Remitente verificado en Resend, ej. `MagnoCorp <contacto@magnocorp.com.mx>` | No |

> Ninguna llave se expone en el frontend: todas se leen dentro de los handlers de servidor.

## Cómo conectar MagnoIA

- Lógica: `src/lib/magnoia.functions.ts` (server function `askMagnoIA`).
- El *system prompt* limita las respuestas a temas empresariales; cualquier otro tema recibe el mensaje institucional definido en el prompt.
- Para cambiar el modelo, edita el campo `model` dentro del handler.
- Si se prefiere OpenAI directo, sustituye la llamada al gateway por `https://api.openai.com/v1/chat/completions` usando `process.env['OPENAI_API_KEY']` **dentro del handler**.

## Cómo configurar el formulario

- Lógica: `src/lib/leads.functions.ts` (`submitContact` y `submitDiagnosticLead`).
- Sin `RESEND_API_KEY`, las solicitudes se registran en los logs del servidor y el usuario recibe confirmación; con la llave, se envía el correo a `LEADS_EMAIL_TO`.
- Incluye validación con Zod, validación en cliente y campo *honeypot* anti-spam.

## Cómo modificar los artículos del blog

Edita `BLOG_POSTS` en `src/lib/site-data.ts`. Cada artículo requiere `slug`, `title`, `category`, `date` (`YYYY-MM-DD`), `excerpt` y `body` (arreglo de párrafos). El listado y el lector se actualizan automáticamente.

## Cómo agregar proyectos y clientes

- Clientes: arreglo `CLIENTS` en `src/lib/site-data.ts`. Cuando exista un archivo de logotipo, colócalo en `src/assets/clientes/` y muéstralo con `object-fit: contain`; mientras no exista, se usa la tarjeta tipográfica actual (no se inventan logotipos).
- Proyectos: arreglo `PROJECT_CASES` en el mismo archivo.
- Servicios y metodología: `SERVICES` y `METHODOLOGY`.
- Preguntas y puntuación del diagnóstico: `src/lib/diagnostic.ts`.

## Estructura

```
src/
├── assets/                 # logotipo (pointer CDN) e imágenes
├── components/site/        # Header, Hero, About, Services, Director,
│                           # Diagnostic, MagnoIA, Projects, Blog, Contact, Footer
├── lib/
│   ├── site-data.ts        # contenido editable (servicios, blog, clientes, contacto)
│   ├── diagnostic.ts       # 20 preguntas + algoritmo de puntuación
│   ├── magnoia.functions.ts# endpoint seguro del asistente
│   └── leads.functions.ts  # envío de formularios y prospectos
├── routes/
│   ├── __root.tsx          # head global, fuentes, favicon
│   └── index.tsx           # página principal + datos estructurados Schema.org
└── styles.css              # sistema de diseño
```
