import { site } from '@/lib/data'

export type SiteContent = typeof site

const MAX_TEXT = 5000
const MAX_ITEMS = 30
const IMAGE_KEYS = new Set(['image', 'logo'])

// Elemento "vuoto" per le liste che partono senza esempi (non si può ricavare da items[0]).
export const ARRAY_ITEM_TEMPLATES: Record<string, unknown> = {
  'events.items': { title: '', date: '', place: '', text: '', image: '', imageAlt: '' },
}

// Riporta `input` alla forma di `template` (i default in lib/data.ts): scarta chiavi
// sconosciute, forza i tipi e usa il valore di default dove l'input non è valido.
// Serve sia per leggere dal DB (contenuti vecchi con campi mancanti) sia per validare
// ciò che arriva dal backoffice prima di salvarlo.
export function conform<T>(template: T, input: unknown, key = '', path = ''): T {
  if (typeof template === 'string') {
    if (typeof input !== 'string') return template
    const value = input.slice(0, MAX_TEXT)
    if (IMAGE_KEYS.has(key) && !/^(\/|https:\/\/)/.test(value)) return template
    return value as T
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(input)) return template
    const itemTemplate = template[0] ?? ARRAY_ITEM_TEMPLATES[path]
    if (itemTemplate === undefined) return template
    return input.slice(0, MAX_ITEMS).map(item => conform(itemTemplate, item, key, path)) as T
  }
  if (template && typeof template === 'object') {
    const source = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}
    return Object.fromEntries(
      Object.entries(template).map(([k, v]) => [k, conform(v, source[k], k, path ? `${path}.${k}` : k)]),
    ) as T
  }
  return template
}

// L'ordine salvato deve contenere tutte e sole le sezioni note, una volta sola:
// scarta il resto e rimette in coda quelle mancanti (es. sezioni aggiunte dopo il salvataggio).
export function normalizeOrder(input: unknown): string[] {
  const known = site.order
  const wanted = Array.isArray(input) ? input.filter((k): k is string => typeof k === 'string') : []
  const valid = wanted.filter((k, i) => known.includes(k) && wanted.indexOf(k) === i)
  return [...valid, ...known.filter(k => !valid.includes(k))]
}

// Punto unico per leggere e validare i contenuti. Menu ed etichette di accessibilità
// non sono modificabili dal backoffice: restano sempre quelli di default.
export function conformSite(input: unknown): SiteContent {
  const source = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}
  return {
    ...conform(site, input),
    nav: site.nav,
    header: site.header,
    order: normalizeOrder(source.order),
  }
}
