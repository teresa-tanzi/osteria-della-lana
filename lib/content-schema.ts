import { site } from '@/lib/data'

export type SiteContent = typeof site

const MAX_TEXT = 5000
const MAX_ITEMS = 30
const IMAGE_KEYS = new Set(['image', 'logo'])

// Riporta `input` alla forma di `template` (i default in lib/data.ts): scarta chiavi
// sconosciute, forza i tipi e usa il valore di default dove l'input non è valido.
// Serve sia per leggere dal DB (contenuti vecchi con campi mancanti) sia per validare
// ciò che arriva da /admin prima di salvarlo.
export function conform<T>(template: T, input: unknown, key = ''): T {
  if (typeof template === 'string') {
    if (typeof input !== 'string') return template
    const value = input.slice(0, MAX_TEXT)
    if (IMAGE_KEYS.has(key) && !/^(\/|https:\/\/)/.test(value)) return template
    return value as T
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(input)) return template
    const itemTemplate = template[0]
    return input.slice(0, MAX_ITEMS).map(item => conform(itemTemplate, item, key)) as T
  }
  if (template && typeof template === 'object') {
    const source = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}
    return Object.fromEntries(
      Object.entries(template).map(([k, v]) => [k, conform(v, source[k], k)]),
    ) as T
  }
  return template
}
