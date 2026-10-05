'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2, X } from 'lucide-react'
import { getIn } from '@/lib/path'
import { useEditor } from '@/components/osteria/edit-context'

// Tutto qui rende lo stesso HTML di prima quando `editing` è false; in modifica aggiunge
// bordi, campi e pulsanti. I controlli usano font-sans per non ereditare il font delle etichette.

const hoverOnly = 'opacity-0 transition-opacity focus-visible:opacity-100 [@media(hover:none)]:opacity-100'
const control = 'inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 font-sans text-xs font-medium normal-case tracking-normal text-cream hover:bg-berry'
const editStyle = 'cursor-text rounded-sm outline-1 outline-offset-2 outline-dashed outline-transparent hover:outline-berry/60 focus:outline-2 focus:outline-solid focus:outline-berry empty:before:opacity-50 empty:before:content-[attr(data-placeholder)]'

type Tag = React.ElementType

// ---------------------------------------------------------------------------- testo

function clean(text: string, multiline: boolean) {
  const normalized = text.replace(/ /g, ' ')
  return multiline ? normalized.trim() : normalized.replace(/\s*\n\s*/g, ' ').trim()
}

// `bare`: nella pagina pubblica stampa solo il testo, senza elemento attorno (per testi dentro link o span già esistenti).
export function T({ path, as: El = 'span', className = '', multiline = false, bare = false }: { path: string; as?: Tag; className?: string; multiline?: boolean; bare?: boolean }) {
  const { site, editing, set } = useEditor()
  const value = (getIn(site, path) as string | undefined) ?? ''
  const ref = useRef<HTMLElement>(null)
  // Il contenuto è gestito a mano (non da React) per non entrare in conflitto con ciò che digita l'utente.
  useLayoutEffect(() => {
    if (editing && ref.current && ref.current.textContent !== value) ref.current.textContent = value
  }, [editing, value])

  if (!editing && bare) return <>{value}</>
  if (!editing) return <El className={`${className} ${multiline ? 'whitespace-pre-line' : ''}`.trim() || undefined}>{value}</El>
  return (
    <El
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-placeholder="Scrivi qui…"
      className={`${className} ${editStyle} ${multiline ? 'whitespace-pre-wrap' : ''}`}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const text = clean(e.currentTarget.textContent ?? '', multiline)
        if (text !== value) set(path, text)
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          if (multiline) document.execCommand('insertText', false, '\n')
          else e.currentTarget.blur()
        }
        // Niente grassetto/corsivo: i contenuti sono testo semplice.
        if ((e.metaKey || e.ctrlKey) && 'biu'.includes(e.key.toLowerCase())) e.preventDefault()
      }}
      onPaste={(e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, multiline ? text : text.replace(/\s*\n\s*/g, ' '))
      }}
      onDrop={(e: React.DragEvent) => e.preventDefault()}
    />
  )
}

// Link che in modifica non naviga (altrimenti cliccare per scrivere farebbe cambiare pagina).
export function SafeLink({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { editing } = useEditor()
  return <a {...props} onClick={editing ? e => e.preventDefault() : undefined}>{children}</a>
}

// ---------------------------------------------------------------------------- liste

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={`absolute -right-2 -top-2 z-40 grid h-7 w-7 place-items-center rounded-full bg-berry text-cream shadow group-hover/item:opacity-100 ${hoverOnly}`}><X size={14} /></button>
}

export function AddButton({ path, label, value, className = '' }: { path: string; label: string; value?: unknown; className?: string }) {
  const { editing, addItem } = useEditor()
  if (!editing) return null
  return <button type="button" onClick={() => addItem(path, value)} className={`${className} inline-flex items-center gap-2 self-start rounded-full border-2 border-dashed border-berry/60 px-4 py-2 font-sans text-sm font-medium normal-case tracking-normal text-berry hover:bg-berry hover:text-cream`}><Plus size={14} /> {label}</button>
}

// Scheda di una lista (un articolo, un evento…): in modifica ha il pulsante per toglierla.
export function Item({ as: El = 'div', path, index, min = 1, className = '', children }: { as?: Tag; path: string; index: number; min?: number; className?: string; children: React.ReactNode }) {
  const { site, editing, removeItem } = useEditor()
  if (!editing) return <El className={className || undefined}>{children}</El>
  const count = (getIn(site, path) as unknown[]).length
  return (
    <El className={`${className} group/item relative`}>
      {children}
      {count > min && <RemoveButton label="Rimuovi" onClick={() => removeItem(path, index)} />}
    </El>
  )
}

// Elenco di paragrafi (lista di stringhe).
export function Paragraphs({ path, className = '', itemClassName = '' }: { path: string; className?: string; itemClassName?: string }) {
  const { site, editing } = useEditor()
  const items = getIn(site, path) as string[]
  return (
    <div className={className}>
      {items.map((_, n) => editing
        ? <Item key={n} path={path} index={n}><T as="p" path={`${path}.${n}`} className={itemClassName} multiline /></Item>
        : <T key={n} as="p" path={`${path}.${n}`} className={itemClassName} />)}
      {editing && <AddButton path={path} label="Aggiungi paragrafo" value="" />}
    </div>
  )
}

export function Swatch({ path, index }: { path: string; index: number }) {
  const { site, editing, set, removeItem } = useEditor()
  const color = getIn(site, `${path}.${index}`) as string
  if (!editing) return <i className="h-10 w-10 rounded-full" style={{ backgroundColor: color }} />
  const count = (getIn(site, path) as unknown[]).length
  return (
    <span className="group/item relative h-10 w-10">
      <i className="block h-10 w-10 rounded-full" style={{ backgroundColor: color }} />
      <input type="color" aria-label="Cambia colore" value={/^#[0-9a-f]{6}$/i.test(color) ? color : '#000000'} onChange={e => set(`${path}.${index}`, e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      {count > 1 && <RemoveButton label="Rimuovi colore" onClick={() => removeItem(path, index)} />}
    </span>
  )
}

// ---------------------------------------------------------------------------- foto

export function Photo({ path, altPath, alt = '', optional = false, className = '' }: { path: string; altPath?: string; alt?: string; optional?: boolean; className?: string }) {
  const { site, editing, set } = useEditor()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [showAlt, setShowAlt] = useState(false)
  const src = (getIn(site, path) as string | undefined) ?? ''
  const altText = altPath ? ((getIn(site, altPath) as string | undefined) ?? '') : alt
  const wrapper = className.includes('absolute') ? className : `relative ${className}`

  if (!editing) return src ? <div className={`group overflow-hidden ${wrapper}`}><img src={src} alt={altText} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div> : null

  async function pick(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      // Caricato solo quando serve: la pagina pubblica non scarica la libreria di upload.
      const { upload } = await import('@vercel/blob/client')
      const blob = await upload(`site/${file.name}`, file, { access: 'public', handleUploadUrl: '/api/backoffice/upload' })
      set(path, blob.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Caricamento non riuscito')
    } finally {
      setBusy(false)
    }
  }

  // Sulla prima schermata la barra va in alto (sotto il menu), perché in basso c'è il testo.
  const bar = className.includes('absolute') ? 'right-4 top-20' : 'inset-x-2 bottom-2'
  return (
    <div className={`group overflow-hidden ${wrapper} ${src ? '' : 'grid min-h-40 place-items-center border-2 border-dashed border-ink/30 bg-ink/5'}`}>
      {src && <img src={src} alt={altText} className="absolute inset-0 h-full w-full object-cover" />}
      <div className={`absolute z-30 flex flex-wrap items-center gap-2 ${bar} ${src ? `group-hover:opacity-100 focus-within:opacity-100 ${hoverOnly}` : ''}`}>
        <label className={`${control} cursor-pointer`}>
          <ImagePlus size={14} /> {busy ? 'Caricamento…' : src ? 'Cambia foto' : 'Aggiungi foto'}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={e => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        {altPath && src && <button type="button" className={control} onClick={() => setShowAlt(!showAlt)}>Descrizione</button>}
        {optional && src && <button type="button" className={control} onClick={() => set(path, '')}><Trash2 size={14} /> Togli</button>}
        {error && <span role="alert" className="rounded bg-berry px-2 py-1 font-sans text-xs normal-case tracking-normal text-cream">{error}</span>}
      </div>
      {showAlt && altPath && (
        <label className="absolute inset-x-2 top-2 z-30 block rounded bg-ink/90 p-2 font-sans text-xs normal-case tracking-normal text-cream">
          Descrizione della foto (letta da chi non la vede)
          <input value={altText} onChange={e => set(altPath, e.target.value)} className="mt-1 w-full rounded bg-white px-2 py-1 text-sm text-ink outline-none" />
        </label>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------- sezioni

// Barra in alto a destra di ogni sezione: posizione attuale e frecce per spostarla.
export function SectionBar({ name, index, side, note }: { name: string; index: number; side?: 'foto' | 'titolo'; note?: string }) {
  const { site, editing, moveSection } = useEditor()
  if (!editing) return null
  const at = site.order.indexOf(name)
  return (
    <div className="absolute right-3 top-3 z-40 flex flex-wrap items-center justify-end gap-1 rounded-full bg-ink/90 py-1 pl-4 pr-1 font-sans text-xs font-medium normal-case tracking-normal text-cream shadow-lg">
      <span>Posizione {index + 1}{side ? ` · ${side} a ${index % 2 === 0 ? 'sinistra' : 'destra'}` : ''}{note ? ` · ${note}` : ''}</span>
      <button type="button" aria-label="Sposta in su" disabled={at <= 0} onClick={() => moveSection(name, -1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-berry disabled:opacity-30"><ArrowUp size={14} /></button>
      <button type="button" aria-label="Sposta in giù" disabled={at === site.order.length - 1} onClick={() => moveSection(name, 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-berry disabled:opacity-30"><ArrowDown size={14} /></button>
    </div>
  )
}
