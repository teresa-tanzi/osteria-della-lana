'use client'

import { useState, useTransition } from 'react'
import { upload } from '@vercel/blob/client'
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2, X } from 'lucide-react'
import { logout, save } from '@/app/backoffice/actions'
import { ARRAY_ITEM_TEMPLATES, type SiteContent } from '@/lib/content-schema'

type Json = string | Json[] | { [key: string]: Json }
type Change = (value: Json) => void

const SECTIONS: Record<string, string> = {
  hero: 'Prima schermata', intro: 'Chi siamo', story: 'La filiera', process: 'Il viaggio della lana',
  colors: 'I colori', creations: 'Le creazioni', osteria: "L'Osteria", events: 'Eventi', values: 'Il nostro filo',
  cta: 'Contatti', logoSection: 'Logo', footer: 'Piè di pagina',
}
const LABELS: Record<string, string> = {
  brand: 'Nome del sito', kicker: 'Sottotitolo', eyebrow: 'Etichetta sopra il titolo', title: 'Titolo',
  text: 'Testo', intro: 'Introduzione', quote: 'Citazione', image: 'Foto',
  imageAlt: 'Descrizione della foto (per chi non la vede)', logo: 'Logo', linkText: 'Testo del link',
  email: 'Email', date: 'Data e orario', place: 'Luogo', swatches: 'Colori', items: 'Elenco', label: 'Titolo', num: 'Numero', location: 'Luogo',
  backToTopText: 'Testo "torna su"', scrollAria: 'Descrizione del pulsante di scorrimento', paragraphs: 'Testo',
}
const label = (key: string) => LABELS[key] ?? key
const field = 'mt-2 w-full border border-ink/30 bg-white px-3 py-2 text-base outline-none focus:border-berry'
const smallButton = 'inline-flex items-center gap-2 border border-ink/30 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] hover:bg-ink hover:text-cream'

function blank(template: Json): Json {
  if (typeof template === 'string') return ''
  if (Array.isArray(template)) return []
  return Object.fromEntries(Object.entries(template).map(([k, v]) => [k, k === 'image' ? v : blank(v)]))
}

function ImageField({ name, value, onChange, optional }: { name: string; value: string; onChange: Change; optional?: boolean }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function pick(file: File | undefined) {
    if (!file) return
    setBusy(true); setError('')
    try {
      const blob = await upload(`site/${file.name}`, file, { access: 'public', handleUploadUrl: '/api/backoffice/upload' })
      onChange(blob.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Caricamento non riuscito')
    } finally { setBusy(false) }
  }
  return (
    <div className="mt-2 flex items-center gap-4">
      {value && <img src={value} alt="" className="h-24 w-24 border border-ink/20 bg-cream object-cover" />}
      <div className="space-y-2">
        <label className={`${smallButton} cursor-pointer`}>
          <ImagePlus size={14} /> {busy ? 'Caricamento…' : `${value ? 'Cambia' : 'Aggiungi'} ${name.toLowerCase()}`}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={e => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        {optional && value && <button type="button" className={`${smallButton} ml-2`} onClick={() => onChange('')}><X size={14} /> Rimuovi</button>}
        <p className="text-xs text-ink/60">JPG, PNG o WebP, max 10 MB</p>
        {error && <p role="alert" className="text-xs text-berry">{error}</p>}
      </div>
    </div>
  )
}

function StringField({ name, value, onChange, color, optionalImage }: { name: string; value: string; onChange: Change; color?: boolean; optionalImage?: boolean }) {
  if (name === 'image' || name === 'logo') return <ImageField name={label(name)} value={value} onChange={onChange} optional={optionalImage} />
  if (color) return <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'} onChange={e => onChange(e.target.value)} className="mt-2 h-10 w-16 border border-ink/30" />
  if (value.length > 60 || value.includes('\n')) return <textarea value={value} rows={Math.min(10, Math.ceil(value.length / 70) + 1)} onChange={e => onChange(e.target.value)} className={field} />
  return <input value={value} onChange={e => onChange(e.target.value)} className={field} />
}

function Node({ name, value, onChange, path = name }: { name: string; value: Json; onChange: Change; path?: string }) {
  if (typeof value === 'string') {
    return <label className="block text-sm font-medium">{label(name)}<StringField name={name} value={value} onChange={onChange} optionalImage={path.startsWith('events.')} /></label>
  }
  if (Array.isArray(value)) {
    const update = (i: number, v: Json) => onChange(value.map((x, j) => (j === i ? v : x)))
    // Le liste che partono vuote (eventi) hanno un modello a parte da cui creare il primo elemento.
    const prototype = (value[0] ?? ARRAY_ITEM_TEMPLATES[path]) as Json | undefined
    return (
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">{label(name)}</legend>
        {value.map((item, i) => (
          <div key={i} className={`flex items-start gap-3 ${typeof item === 'string' ? '' : 'border border-ink/15 bg-white/60 p-4'}`}>
            <div className="flex-1 space-y-4">
              {typeof item === 'string'
                ? <StringField name={`${name} ${i + 1}`} value={item} color={name === 'swatches'} onChange={v => update(i, v)} />
                : <Node name={`${label(name)} ${i + 1}`} value={item} path={path} onChange={v => update(i, v)} />}
            </div>
            <button type="button" aria-label="Rimuovi" onClick={() => onChange(value.filter((_, j) => j !== i))} className="mt-2 p-2 text-ink/50 hover:text-berry"><Trash2 size={16} /></button>
          </div>
        ))}
        {prototype !== undefined && value.length < 30 && (
          <button type="button" className={smallButton} onClick={() => onChange([...value, typeof prototype === 'string' && name === 'swatches' ? '#000000' : blank(prototype)])}><Plus size={14} /> {path === 'events.items' ? 'Aggiungi un evento' : 'Aggiungi'}</button>
        )}
      </fieldset>
    )
  }
  return (
    <div className="space-y-5">
      {Object.entries(value).map(([key, v]) => (
        <Node key={key} name={key} value={v} path={`${path}.${key}`} onChange={nv => onChange({ ...value, [key]: nv })} />
      ))}
    </div>
  )
}

const ORDERABLE = ['intro', 'story', 'process', 'colors', 'creations', 'osteria', 'events', 'values']

function OrderEditor({ order, hasEvents, onChange }: { order: string[]; hasEvents: boolean; onChange: (order: string[]) => void }) {
  const move = (from: number, to: number) => {
    const next = [...order]
    next.splice(to, 0, next.splice(from, 1)[0])
    onChange(next)
  }
  // Gli eventi sono nascosti sul sito finché non ce n'è uno: non occupano una posizione.
  const shown = order.filter(key => key !== 'events' || hasEvents)
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink/70">Il layout dipende dalla posizione: nelle posizioni dispari (1ª, 3ª, 5ª…) la foto sta a sinistra, in quelle pari a destra, e gli sfondi si alternano.</p>
      <ol className="space-y-2">
        {order.map((key, i) => {
          const position = shown.indexOf(key) + 1
          return (
            <li key={key} className="flex items-center gap-3 border border-ink/15 bg-white px-4 py-3">
              <span className="w-6 font-mono text-sm text-berry">{position || '–'}</span>
              <span className="flex-1">{SECTIONS[key]}<span className="ml-3 text-xs text-ink/55">{position ? (position % 2 ? 'foto a sinistra' : 'foto a destra') : 'nascosta: nessun evento inserito'}</span></span>
              <button type="button" aria-label={`Sposta in alto: ${SECTIONS[key]}`} disabled={i === 0} onClick={() => move(i, i - 1)} className="p-2 hover:text-berry disabled:opacity-30"><ArrowUp size={16} /></button>
              <button type="button" aria-label={`Sposta in basso: ${SECTIONS[key]}`} disabled={i === order.length - 1} onClick={() => move(i, i + 1)} className="p-2 hover:text-berry disabled:opacity-30"><ArrowDown size={16} /></button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function Editor({ initial }: { initial: SiteContent }) {
  const [data, setData] = useState<SiteContent>(initial)
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const set = (key: string) => (value: Json) => { setData(d => ({ ...d, [key]: value }) as SiteContent); setStatus(null) }
  // Stesso ordine della pagina: prima schermata, sezioni riordinabili, contatti, logo, piè di pagina.
  const sections = ['hero', ...data.order.filter(key => ORDERABLE.includes(key)), 'cta', 'logoSection', 'footer']

  function submit() {
    startTransition(async () => {
      const result = await save(data)
      setStatus(result.ok ? { ok: true, text: 'Pubblicato! Il sito è aggiornato.' } : { ok: false, text: result.error ?? 'Errore' })
    })
  }

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-ink/15 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-berry">Backoffice</p>
            <p className="font-serif text-xl">Osteria della Lana</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm underline">Vedi il sito</a>
            <form action={logout}><button className={smallButton}>Esci</button></form>
            <button type="button" onClick={submit} disabled={pending} className="bg-ink px-5 py-3 font-mono text-sm uppercase tracking-[0.18em] text-cream disabled:opacity-60">
              {pending ? 'Salvataggio…' : 'Salva e pubblica'}
            </button>
          </div>
        </div>
        {status && <p role="status" className={`px-5 pb-3 text-center text-sm ${status.ok ? 'text-ink' : 'text-berry'}`}>{status.text}</p>}
      </header>
      <main className="mx-auto max-w-3xl space-y-4 px-5 py-8">
        <details className="border border-ink/15 bg-white/60" open>
          <summary className="cursor-pointer px-5 py-4 font-serif text-2xl">Generale</summary>
          <div className="space-y-5 px-5 pb-6">
            <Node name="brand" value={data.brand} onChange={set('brand')} />
            <Node name="kicker" value={data.kicker} onChange={set('kicker')} />
          </div>
        </details>
        <details className="border border-ink/15 bg-white/60">
          <summary className="cursor-pointer px-5 py-4 font-serif text-2xl">Ordine delle sezioni</summary>
          <div className="px-5 pb-6"><OrderEditor order={data.order} hasEvents={data.events.items.length > 0} onChange={order => { setData(d => ({ ...d, order })); setStatus(null) }} /></div>
        </details>
        {sections.map(key => (
          <details key={key} className="border border-ink/15 bg-white/60">
            <summary className="cursor-pointer px-5 py-4 font-serif text-2xl">{SECTIONS[key]}</summary>
            <div className="px-5 pb-6"><Node name={key} value={(data as Record<string, Json>)[key]} onChange={set(key)} /></div>
          </details>
        ))}
      </main>
    </div>
  )
}
