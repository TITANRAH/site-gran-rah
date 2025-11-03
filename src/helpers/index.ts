/**
 * Formatea una fecha en formato ISO a formato legible en español
 * @param dateStr - Fecha en formato ISO string
 * @returns Fecha formateada en español (ej: "lunes, 15 de enero de 2024")
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Formatea una fecha corta sin el día de la semana
 * @param dateStr - Fecha en formato ISO string
 * @returns Fecha formateada (ej: "15 de enero de 2024")
 */
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Convierte null o undefined a string vacío
 * @param arg - Valor a convertir
 * @returns String vacío si el valor es null/undefined, el valor original en caso contrario
 */
export function nullToEmptyString(arg: unknown): string {
  return arg as string ?? "";
}

/**
 * Decodifica entidades HTML (ej: &#8216; a ', &amp; a &)
 * @param text - Texto con entidades HTML
 * @returns Texto decodificado
 */
export function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&#8216;": "'",
    "&#8217;": "'",
    "&#8220;": '"',
    "&#8221;": '"',
    "&#8211;": "-",
    "&#8212;": "-",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
  };

  let decodedText = text;
  for (const [entity, char] of Object.entries(entities)) {
    decodedText = decodedText.replace(new RegExp(entity, "g"), char);
  }

  return decodedText;
}

/**
 * Extrae texto plano del HTML renderizado de WordPress y decodifica entidades
 * @param htmlString - String HTML
 * @returns Texto plano sin etiquetas HTML y con entidades decodificadas
 */
export function stripHtml(htmlString: string): string {
  const textWithoutTags = htmlString.replace(/<[^>]*>/g, "");
  return decodeHtmlEntities(textWithoutTags);
}

/**
 * Trunca un texto a un número específico de palabras
 * @param text - Texto a truncar
 * @param maxWords - Número máximo de palabras
 * @returns Texto truncado con "..." si excede el límite
 */
export function truncateWords(text: string, maxWords: number = 30): string {
  const words = text.split(" ");
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(" ") + "...";
}

/**
 * Obtiene el año de una fecha
 * @param dateStr - Fecha en formato ISO string
 * @returns Año como número
 */
export function getYear(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

/**
 * Parsea una fecha de ACF (formato YYYYMMDD) o ISO string a objeto Date
 * @param dateStr - Fecha en formato YYYYMMDD o ISO string
 * @returns Objeto Date o null si es inválido
 */
export function parseEventDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;

  // Si viene en formato YYYYMMDD de ACF Date Picker
  if (/^\d{8}$/.test(dateStr)) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return new Date(`${year}-${month}-${day}`);
  }

  // Si viene en otro formato, intentar parsearlo
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formatea una fecha para mostrar en timeline de eventos
 * @param date - Objeto Date
 * @returns Objeto con día, mes, año y día de la semana formateados
 */
export function formatEventDate(date: Date): {
  day: string;
  month: string;
  year: string;
  weekday: string;
} {
  const dayNum = new Intl.DateTimeFormat("es-ES", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("es-ES", { month: "short" }).format(date).toUpperCase();
  const year = new Intl.DateTimeFormat("es-ES", { year: "numeric" }).format(date);
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(date).toUpperCase();

  return {
    day: dayNum,
    month: month.replace(".", ""), // Remover punto del mes abreviado
    year,
    weekday: weekday.replace(".", "")
  };
}

/**
 * Formatea una fecha de evento completa en español
 * @param date - Objeto Date
 * @returns Fecha formateada (ej: "Viernes, 15 de enero de 2024")
 */
export function formatEventDateFull(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(price);
}

/**
 * Formatea una fecha para el timeline de eventos (tarjeta de fecha)
 * @param date - Objeto Date
 * @returns Objeto con día, mes, año y día de la semana formateados
 */
export function formatEventDateForTimeline(date: Date): {
  day: string;
  month: string;
  year: string;
  weekday: string;
} {
  const dayNum = new Intl.DateTimeFormat("es-ES", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("es-ES", { month: "short" }).format(date).toUpperCase();
  const year = new Intl.DateTimeFormat("es-ES", { year: "numeric" }).format(date);
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(date).toUpperCase();

  return {
    day: dayNum,
    month: month.replace(".", ""), // Remover punto del mes abreviado
    year,
    weekday: weekday.replace(".", "")
  };
}
