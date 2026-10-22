# Conocimiento de MagnoCorp

## Páginas y administración

- Biblioteca pública: `/conocimiento`.
- Aviso de privacidad: `/conocimiento/aviso-de-privacidad`, enlazado desde el pie de página, el formulario de recursos y la configuración privada.
- Página pública de cada recurso: `/conocimiento/<slug>`.
- Administración privada: `/admin/conocimiento` (desde Administrar recursos en la biblioteca o Administración en el pie de página).
- Acceso: `/auth`; recuperación: `/reset-password`.

La biblioteca empieza vacía: no se han inventado descargas. Agrega tus PDF, videos o plantillas reales desde Crear recurso. Los borradores y archivados nunca aparecen en el catálogo público.

## Primer administrador

El correo de contacto existente, `juan.hdz0429@gmail.com`, puede reclamar el primer acceso de administrador únicamente después de verificar su correo. Ingresa con Google usando esa cuenta, o crea la cuenta por correo y confirma el mensaje recibido. No existe una contraseña predeterminada. Crear otras cuentas no concede acceso administrativo. Una vez que existe un administrador, el reclamo inicial queda cerrado.

Para autorizar más personas, asigna el rol `admin` en `user_roles` desde **Cloud → Database**, usando el identificador de su cuenta de **Users**. No guardes roles en metadatos del usuario ni en el navegador.

## Antes de habilitar descargas

1. Completa y revisa el borrador de aviso de privacidad de Conocimiento: MagnoCorp y `juan.hdz0429@gmail.com` fueron confirmados por el propietario, pero faltan el domicilio completo y la revisión de proveedores, conservación y tecnologías. No se ha inventado un domicilio ni activado la captura de datos. Una vez finalizado y aprobado, en Administración → Configuración agrega la URL real del aviso publicado y una versión distinta de `pending`. Consulta con tu asesor las obligaciones aplicables en México.
2. Crea un recurso, carga su archivo y opcionalmente una portada.
3. Elige una categoría, formato y fecha. Si dejas la fecha vacía al publicar, se utiliza el momento actual. Una fecha futura programa su aparición.
4. Selecciona Publicado y guarda.
5. Revisa el recurso desde la biblioteca. El formulario requiere nombre y correo; teléfono y publicidad son opcionales.

Si no existe un aviso confirmado, se muestran los materiales publicados pero no se permite enviar datos personales. Una solicitud se confirma únicamente después de comprobar el archivo y guardar el acceso.

## Archivos

- `knowledge-files`: privado, hasta 50 MB; el administrador puede reducir el límite desde Configuración.
- `knowledge-covers`: privado, hasta 5 MB; sus portadas publicadas se muestran con enlaces temporales.
- PDF, MP4/WebM, XLSX/DOCX/CSV y portadas JPG/PNG/WebP.
- Archivos con nombres aleatorios, validación de formato y tamaño, verificación de cabecera para PDF y progreso de carga.
- Acceso temporal al material: 10 minutos. Las direcciones originales privadas no se publican en el catálogo.
- Videos externos: solo reproducción en línea. Para permitir descarga, carga un archivo de video y activa Permitir descargar el archivo.
- Desactivar la descarga oculta el botón de descarga; no constituye DRM ni impide que alguien con permiso de reproducción capture el video.
- Al reemplazar archivos, los anteriores permanecen privados para evitar borrar material todavía usado. Se pueden retirar posteriormente desde Storage cuando ya no se necesiten.

## Prospectos y métricas

Los datos se guardan en **Cloud → Database → `leads`**; cada solicitud queda en `resource_accesses` y también puede revisarse desde **Administración → Prospectos y métricas**.

- Correo normalizado a minúsculas; un correo corresponde a un prospecto que puede solicitar varios recursos.
- Repeticiones del mismo recurso en dos minutos reutilizan la solicitud; la interfaz bloquea doble clic durante el envío.
- Consentimiento comercial independiente, desmarcado por defecto y guardado por solicitud con la versión del aviso. Solicitar de nuevo con el mismo correo no sobrescribe la identidad ni la autorización de registros anteriores.
- Filtros por fecha y recurso, solicitudes, nuevos prospectos, recursos más solicitados y exportación CSV autorizada.
- CSV paginado sin el límite de 1.000 filas y protección contra fórmulas de hoja de cálculo.
- No se muestra una tasa de conversión: no existe medición fiable de visitas individuales por recurso.
- No se envían correos de notificación todavía. Para activarlos hace falta un plan de pago y verificar un dominio propio. Los dominios comprados en Lovable se verifican automáticamente; otros requieren DNS. Después de verificarlo, pide activar las notificaciones al propietario.

## Decisiones de seguridad

- Los roles se comprueban en cada acción del servidor y en las políticas de datos y archivos; iniciar sesión no concede privilegios.
- El catálogo público es una proyección de columnas seguras; no incluye prospectos, enlaces de video privados ni claves de archivos descargables.
- Validación Zod en navegador y servidor, protección CSRF, campo antispam y límite persistente de 10 solicitudes cada 10 minutos por IP cuando está disponible, o por correo normalizado cuando no está disponible (con hash, no en texto plano). El límite por correo no sustituye una protección contra abuso distribuido.
- Datos personales enviados solo en el cuerpo de la solicitud, nunca en parámetros de URL ni logs.
- Nuevas tablas con permisos explícitos y RLS. Archivos descargables sin lectura anónima.
- Confirmación de eliminación con aviso de la pérdida de solicitudes del recurso. El prospecto permanece salvo que lo elimine el propietario.

## Variables de entorno

Lovable Cloud genera y mantiene automáticamente:

- Navegador: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Servidor: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

No hace falta pegar credenciales ni obtener claves privadas. No se ha modificado la configuración de los formularios o el asistente anteriores.

## Publicación y operación

Publica el sitio para que las páginas y metadatos nuevos lleguen a `https://magnocorp.online`; no se ha publicado automáticamente. Prueba con un PDF propio y tu aviso real antes de compartir el enlace.

Antes de borrar datos importantes, conserva una exportación de prospectos y una copia de tus archivos originales. Consulta la disponibilidad y retención de copias de seguridad de tu plan en Cloud; no se ha configurado ni verificado una política adicional de respaldos automáticos.

## Pruebas

`bun test src/lib/knowledge.test.ts` verifica nombre/correo obligatorios, teléfono opcional y formato, consentimiento independiente, antispam, publicación con archivo, fechas, permisos de video y CSV seguro.

Verificado en el navegador con una cuenta temporal autorizada: inicio de sesión, subida real de PDF y portada, guardado, publicación visible en la biblioteca, archivo oculto, eliminación, exportación CSV, configuración, cierre de sesión y rechazo de una cuenta sin rol. La cuenta, sus permisos y materiales de prueba se eliminaron. Se comprobó que el formulario permanece bloqueado sin aviso real. La captura y descarga final para visitantes siguen pendientes de un aviso confirmado y material propio; la recuperación por correo no se verificó con un enlace real.