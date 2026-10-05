// Lettura/scrittura immutabile di un valore dentro i contenuti tramite percorso ("process.items.1.title").

export function getIn(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => (current == null ? undefined : (current as Record<string, unknown>)[key]), obj)
}

export function setIn<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split('.')
  const copy = (Array.isArray(obj) ? [...obj] : { ...obj }) as Record<string, unknown>
  copy[head] = rest.length ? setIn(copy[head], rest.join('.'), value) : value
  return copy as T
}

// Elemento nuovo con la stessa forma di `template`: testi vuoti, ma la foto resta quella del
// modello (così una scheda nuova ha già un'immagine da sostituire).
export function blankLike(template: unknown): unknown {
  if (typeof template === 'string') return ''
  if (Array.isArray(template)) return []
  if (template && typeof template === 'object') {
    return Object.fromEntries(Object.entries(template).map(([k, v]) => [k, k === 'image' ? v : blankLike(v)]))
  }
  return template
}
