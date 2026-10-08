/**
 * Converts a text string (e.g. title or name) into a clean, URL-friendly slug.
 * Handles Swedish diacritics (å, ä, ö) and non-alphanumeric characters properly.
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/é/g, 'e')
    .replace(/ü/g, 'u')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove remaining diacritics
    .replace(/[^a-z0-9 -]/g, '')     // remove invalid chars
    .replace(/\s+/g, '-')            // collapse whitespace into -
    .replace(/-+/g, '-')            // collapse multiple dashes
    .replace(/^-+/, '')             // trim leading -
    .replace(/-+$/, '');            // trim trailing -
}
