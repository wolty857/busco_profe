/**
 * Sanitiza texto de entrada eliminando etiquetas HTML peligrosas
 * para prevenir ataques XSS (Cross-Site Scripting).
 */
export function sanitizeText(input: string): string {
  return input
    // Eliminar etiquetas <script>...</script>
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Eliminar etiquetas <iframe>...</iframe>
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    // Eliminar etiquetas <object>...</object>
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    // Eliminar etiquetas <embed>...</embed>
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    // Eliminar atributos on* (onclick, onerror, etc.)
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, "")
    // Eliminar cualquier etiqueta HTML restante
    .replace(/<[^>]*>/g, "")
    .trim();
}
