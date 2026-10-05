'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { logout, save } from '@/app/backoffice/actions'
import OsteriaPage from '@/components/osteria/osteria-page'
import type { SiteContent } from '@/lib/content-schema'

const button = 'rounded-full border border-cream/40 px-4 py-2 font-sans text-sm font-medium hover:bg-cream hover:text-ink'

// La pagina del sito, ma modificabile: clic su un testo per scriverci, su una foto per cambiarla.
export function InlineEditor({ initial }: { initial: SiteContent }) {
  const [site, setSite] = useState(initial)
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const change = useCallback((next: SiteContent) => {
    setSite(next)
    setDirty(true)
    setStatus(null)
  }, [])

  // Avvisa se si chiude la scheda con modifiche non salvate.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function submit() {
    startTransition(async () => {
      const result = await save(site)
      if (result.ok) setDirty(false)
      setStatus(result.ok ? { ok: true, text: 'Pubblicato! Il sito è aggiornato.' } : { ok: false, text: result.error ?? 'Errore' })
    })
  }

  return (
    <div className="pb-24">
      <OsteriaPage site={site} onChange={change} />
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-cream/20 bg-ink/95 px-4 py-3 text-cream backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p role="status" className={`font-sans text-sm ${status && !status.ok ? 'text-gold' : 'text-cream/80'}`}>
            {status ? status.text : dirty ? 'Modifiche non salvate' : 'Clicca un testo per modificarlo, una foto per cambiarla.'}
          </p>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className={button}>Vedi il sito</a>
            <form action={logout}><button className={button}>Esci</button></form>
            <button type="button" onClick={submit} disabled={pending || !dirty} className="rounded-full bg-berry px-5 py-2 font-sans text-sm font-semibold text-cream hover:bg-gold disabled:opacity-50">
              {pending ? 'Salvataggio…' : 'Salva e pubblica'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
