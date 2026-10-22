export const KNOWLEDGE_PRIVACY = {
  responsibleParty: "MagnoCorp",
  contactEmail: "juan.hdz0429@gmail.com",
  revisedOn: "22 de octubre de 2026",
  version: "Borrador · 2026-10-22",
} as const;

export const PRIVACY_SECTIONS = [
  {
    id: "responsable",
    title: "Responsable y contacto",
    paragraphs: [
      "MagnoCorp es el responsable indicado del tratamiento de los datos personales solicitados en la biblioteca Conocimiento. Este aviso se limita a las solicitudes de acceso a sus recursos gratuitos.",
      "Domicilio completo del responsable: pendiente de confirmar. La ubicación general del negocio en Mazatlán, Sinaloa, México no sustituye este dato. Si MagnoCorp es una marca comercial, debe completarse también la denominación legal de la persona física o moral que la opera.",
    ],
  },
  {
    id: "datos",
    title: "Datos que se solicitan",
    paragraphs: [
      "Para solicitar un recurso se requieren tu nombre completo y correo electrónico. El número de teléfono es opcional: puedes dejarlo vacío sin perder acceso al material. No solicitamos datos personales sensibles en este formulario.",
      "Se registra el recurso solicitado, la fecha de la solicitud, la versión del aviso presentada y tu elección de recibir o no comunicaciones comerciales. Cada solicitud conserva su propia evidencia de identidad y consentimiento.",
      "Para prevenir solicitudes automatizadas y proteger el servicio, puede utilizarse la dirección IP proporcionada por el servicio de alojamiento o, si no está disponible, el correo normalizado para generar una referencia de control de solicitudes.",
    ],
  },
  {
    id: "finalidades",
    title: "Finalidades necesarias y opcionales",
    paragraphs: [
      "Finalidades necesarias: gestionar y registrar la solicitud, habilitar la descarga o reproducción del recurso disponible, atender incidencias relacionadas con ese acceso y proteger el servicio frente al abuso. Si facilitas tu teléfono, su uso se limita a atender asuntos relacionados con tu solicitud.",
      "Finalidad opcional: enviarte por correo electrónico novedades y comunicaciones comerciales de MagnoCorp, únicamente si marcas la casilla independiente destinada a ello. La casilla está desmarcada por defecto; negarte no condiciona el acceso al recurso.",
      "Puedes retirar esa autorización comercial escribiendo al contacto de privacidad con el asunto «Baja de comunicaciones comerciales». No necesitas aceptar publicidad para solicitar materiales gratuitos.",
    ],
  },
  {
    id: "almacenamiento",
    title: "Almacenamiento y acceso a la información",
    paragraphs: [
      "Los registros de solicitudes se almacenan en Lovable Cloud. La consulta y administración de prospectos se restringen al equipo con permisos de administración. Los archivos de recursos se mantienen en almacenamiento privado y su acceso se entrega mediante enlaces temporales.",
      "Los proveedores que participan en el alojamiento y almacenamiento pueden tratar información para prestar esos servicios. Antes de finalizar este aviso deben confirmarse las condiciones aplicables a dichos proveedores, la conservación de registros y cualquier transferencia nacional o internacional que corresponda. No se presume una ubicación de servidores ni una transferencia sin verificarla.",
      "Si el recurso enlaza a un proveedor externo de video, o decides abrir WhatsApp u otro sitio externo, tu visita queda también sujeta al aviso de privacidad de ese proveedor.",
    ],
  },
  {
    id: "derechos",
    title: "Tus derechos y retiro del consentimiento",
    paragraphs: [
      "Puedes solicitar acceso a tus datos, rectificación de información incorrecta, cancelación cuando proceda u oposición al tratamiento (derechos ARCO). También puedes solicitar la revocación del consentimiento y limitar el uso o divulgación de tus datos.",
      "Envía un correo al contacto de privacidad con el asunto «Solicitud de privacidad». Incluye tu nombre, un medio para recibir respuesta, el derecho que deseas ejercer y una descripción clara de la solicitud. Para rectificar información, indica qué dato debe corregirse y, cuando corresponda, la documentación que lo sustente.",
      "Para proteger tus datos, podrá ser necesario verificar tu identidad o la representación legal antes de entregar información o realizar cambios. No envíes documentos de identidad por el formulario de recursos; solicita primero el procedimiento de verificación por correo.",
      "Las solicitudes se atenderán conforme a los requisitos y plazos de la legislación mexicana aplicable. La cancelación o revocación puede estar sujeta a obligaciones legales de conservación; en ese caso se informará el motivo y el alcance de la restricción.",
    ],
  },
  {
    id: "conservacion",
    title: "Conservación y seguridad",
    paragraphs: [
      "La conservación debe limitarse al tiempo necesario para las finalidades informadas y las obligaciones legales aplicables. Antes de la aprobación final, MagnoCorp deberá confirmar su política de conservación, bloqueo y eliminación de solicitudes y de evidencia de consentimiento.",
      "El servicio utiliza controles de acceso y almacenamiento privado para reducir el riesgo de consulta no autorizada. Ningún servicio en línea puede garantizar la ausencia absoluta de incidentes. Si necesitas eliminar un registro o conocer su situación, utiliza el contacto de privacidad.",
    ],
  },
  {
    id: "tecnologias",
    title: "Tecnologías y servicios externos",
    paragraphs: [
      "El acceso administrativo utiliza mecanismos de sesión para mantener autenticado al equipo. La protección del servicio puede tratar información técnica de las solicitudes. La navegación o reproducción en servicios externos puede implicar tecnologías propias de esos proveedores.",
      "Este borrador no afirma que el sitio carezca de cookies, analítica o registros de alojamiento. Su inventario y los controles aplicables deben verificarse en el sitio publicado antes de finalizar el aviso. Puedes administrar cookies y almacenamiento local desde las opciones de privacidad de tu navegador; esto puede afectar el acceso administrativo.",
    ],
  },
  {
    id: "cambios",
    title: "Actualizaciones del aviso",
    paragraphs: [
      "Las actualizaciones se publicarán en esta misma página con su fecha y versión. Cuando un cambio requiera un nuevo consentimiento, deberá solicitarse antes de aplicar las nuevas finalidades. La versión asociada a cada solicitud de recurso se conserva en el registro de acceso.",
      "Este texto es un borrador para revisión, no una certificación de cumplimiento legal. Su configuración no habilita la captura de datos mientras el aviso permanezca pendiente de confirmación.",
    ],
  },
] as const;