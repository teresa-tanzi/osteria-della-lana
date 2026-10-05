'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, Menu, X } from 'lucide-react'
import { ARRAY_ITEM_TEMPLATES, type SiteContent } from '@/lib/content-schema'
import { blankLike, getIn, setIn } from '@/lib/path'
import { EditorProvider, useEditor, type EditorApi } from '@/components/osteria/edit-context'
import { AddButton, Item, Paragraphs, Photo, SafeLink, SectionBar, Swatch, T } from '@/components/osteria/editable'
import { Facebook, Instagram } from '@/components/osteria/brand-icons'

// Layout in base alla posizione (1ª, 2ª, 3ª… tra le sezioni visibili), non alla sezione:
// posizioni dispari → foto a sinistra e sfondo chiaro, pari → foto a destra e sfondo crema.
const photoLeft = (i: number) => i % 2 === 0
const tone = (i: number) => (i % 2 === 0 ? '' : 'bg-cream')
const pad = 'px-5 py-24 sm:px-8 sm:py-32'
const MAX_ITEMS = 30

// Ancora di ogni sezione riordinabile (usata da menu e freccia della prima schermata).
const SECTION_IDS: Record<string, string> = {
  intro: 'beetoneghe', story: 'filo', process: 'lana', colors: 'colori',
  creations: 'creazioni', osteria: 'osteria', events: 'eventi', values: 'valori',
}

function Heading({ path, className = '' }: { path: string; className?: string }) {
  return <div className={`space-y-4 ${className}`}><T as="p" path={`${path}.eyebrow`} className="font-mono font-semibold text-sm uppercase tracking-[0.24em] text-berry" /><T as="h2" path={`${path}.title`} className="font-serif text-4xl leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl" /></div>
}
function Header({ site, links }: { site: SiteContent; links: [string, string][] }) {
  const [open, setOpen] = useState(false)
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/20 bg-ink/85 text-cream backdrop-blur-md"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><SafeLink href="#top" className="font-serif text-xl tracking-tight"><T path="brand" bare /></SafeLink><nav className="hidden gap-5 min-[1100px]:flex">{links.map(([label, href]) => <a key={href} href={href} className="whitespace-nowrap font-mono font-semibold text-sm uppercase tracking-[0.08em] text-cream/80 transition-colors hover:text-gold">{label}</a>)}</nav><button className="min-[1100px]:hidden" aria-label={open ? site.header.closeMenuAria : site.header.openMenuAria} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div>{open && <nav className="flex flex-col gap-5 border-t border-cream/15 bg-ink px-5 py-6 min-[1100px]:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="font-mono font-semibold text-base uppercase tracking-[0.15em]">{label}</a>)}</nav>}</header>
}

type SectionProps = { site: SiteContent; i: number }

// Contenitore comune delle sezioni: sfondo e margini dalla posizione; in modifica aggiunge la barra di spostamento.
function Section({ name, i, id, side, note, children }: { name?: string; i: number; id?: string; side?: 'foto' | 'titolo'; note?: string; children: React.ReactNode }) {
  const { editing } = useEditor()
  return <section id={id} className={`${tone(i)} ${pad}${editing ? ' relative' : ''}`}>{name && <SectionBar name={name} index={i} side={side} note={note} />}{children}</section>
}

function Intro({ i }: SectionProps) {
  const left = photoLeft(i)
  return <Section name="intro" i={i} id={SECTION_IDS.intro} side="titolo"><div className={`mx-auto grid max-w-7xl gap-12 lg:gap-24 ${left ? 'lg:grid-cols-[0.8fr_1.2fr]' : 'lg:grid-cols-[1.2fr_0.8fr]'}`}><Heading path="intro" className={left ? '' : 'lg:order-2'} /><div className={`space-y-8 text-lg leading-8 text-ink/75 ${left ? '' : 'lg:order-1'}`}><Paragraphs path="intro.paragraphs" className="space-y-5" /><T as="blockquote" path="intro.quote" className="border-l-2 border-berry pl-5 font-serif text-3xl leading-tight text-berry" /></div></div></Section>
}
function Story({ i }: SectionProps) {
  const left = photoLeft(i)
  return <Section name="story" i={i} id={SECTION_IDS.story} side="foto"><div className={`mx-auto grid max-w-7xl gap-10 lg:items-center lg:gap-24 ${left ? 'lg:grid-cols-[1.1fr_0.9fr]' : 'lg:grid-cols-[0.9fr_1.1fr]'}`}><Photo path="story.image" altPath="story.imageAlt" className={`aspect-[4/5] ${left ? '' : 'lg:order-2'}`} /><div className={`space-y-7 ${left ? '' : 'lg:order-1'}`}><Heading path="story" /><Paragraphs path="story.text" className="max-w-lg space-y-5 text-lg leading-8 text-ink/75" /><SafeLink href="#creazioni" className="inline-flex items-center gap-3 border-b border-ink pb-2 font-mono font-semibold text-sm uppercase tracking-[0.18em]"><T path="story.linkText" bare /> <ArrowUpRight size={15} /></SafeLink></div></div></Section>
}
function Process({ site, i }: SectionProps) {
  return <Section name="process" i={i} id={SECTION_IDS.process}><div className="mx-auto max-w-7xl"><Heading path="process" /><T as="p" path="process.intro" className="mt-6 text-lg leading-8 text-ink/75" /><div className="mt-14 grid gap-8 md:grid-cols-3">{site.process.items.map((item, n) => <Item key={n} as="article" path="process.items" index={n}><Photo path={`process.items.${n}.image`} alt={item.title} className="aspect-[4/5]" /><div className="flex gap-5 pt-5"><span className="font-mono font-semibold text-base text-berry">{n + 1}</span><div><T as="h3" path={`process.items.${n}.title`} className="font-serif text-2xl" /><T as="p" path={`process.items.${n}.text`} className="mt-3 text-sm leading-6 text-ink/65" /></div></div></Item>)}</div><AddButton path="process.items" label="Aggiungi un passaggio" className="mt-8" /></div></Section>
}
function Colors({ site, i }: SectionProps) {
  const { editing } = useEditor()
  const left = photoLeft(i)
  return <Section name="colors" i={i} id={SECTION_IDS.colors} side="foto"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-24"><div className={`order-2 space-y-7 ${left ? 'lg:order-2' : 'lg:order-1'}`}><Heading path="colors" /><Paragraphs path="colors.text" className="max-w-md space-y-5 text-lg leading-8 text-ink/75" /><T as="blockquote" path="colors.quote" className="border-l-2 border-berry pl-5 font-serif text-3xl leading-tight text-berry" /><div className={`flex gap-2 pt-2${editing ? ' items-center' : ''}`}>{site.colors.swatches.map((_, n) => <Swatch key={n} path="colors.swatches" index={n} />)}<AddButton path="colors.swatches" label="Colore" value="#c4bd4e" /></div></div><Photo path="colors.image" altPath="colors.imageAlt" className={`order-1 aspect-square ${left ? 'lg:order-1' : 'lg:order-2'}`} /></div></Section>
}
function Creations({ site, i }: SectionProps) {
  return <Section name="creations" i={i} id={SECTION_IDS.creations}><div className="mx-auto max-w-7xl"><Heading path="creations" /><T as="p" path="creations.intro" className="mt-6 text-lg leading-8 text-ink/75" /><div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6">{site.creations.items.map((_, n) => <Item key={n} as="article" path="creations.items" index={n} className={n === 0 ? 'col-span-2' : ''}><Photo path={`creations.items.${n}.image`} altPath={`creations.items.${n}.title`} className={n === 0 ? 'aspect-[16/8]' : 'aspect-square'} /></Item>)}</div><AddButton path="creations.items" label="Aggiungi una foto" className="mt-8" /></div></Section>
}
function Osteria({ i }: SectionProps) {
  return <Section name="osteria" i={i} id={SECTION_IDS.osteria}><div className="mx-auto max-w-7xl"><Heading path="osteria" /><Paragraphs path="osteria.text" className="mt-6 space-y-5 text-lg leading-8 text-ink/75" /><Photo path="osteria.image" altPath="osteria.imageAlt" className="mt-14 aspect-[16/9]" /></div></Section>
}
function Events({ site, i }: SectionProps) {
  const { editing } = useEditor()
  const { events } = site
  return <Section name="events" i={i} id={SECTION_IDS.events} side="foto" note={events.items.length === 0 ? 'nascosta sul sito finché non aggiungi un evento' : undefined}><div className="mx-auto max-w-7xl"><Heading path="events" />{(events.intro || editing) && <T as="p" path="events.intro" className="mt-6 text-lg leading-8 text-ink/75" />}<div className="mt-14 space-y-16 sm:space-y-24">{events.items.map((event, n) => {
    // Le foto degli eventi continuano ad alternarsi, a partire dal lato della sezione;
    // gli eventi senza foto non occupano un turno.
    const left = photoLeft(i + events.items.slice(0, n).filter(e => e.image).length)
    const withPhoto = event.image || editing
    return <Item key={n} as="article" path="events.items" index={n} min={0} className={withPhoto ? 'grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-24' : 'max-w-2xl'}>{withPhoto && <Photo path={`events.items.${n}.image`} altPath={`events.items.${n}.imageAlt`} alt={event.title} optional className={`aspect-[4/3] ${left ? '' : 'lg:order-2'}`} />}<div className={`space-y-4 ${left ? '' : 'lg:order-1'}`}>{editing
      ? <p className="font-mono font-semibold text-sm uppercase tracking-[0.24em] text-berry"><T path={`events.items.${n}.date`} /> · <T path={`events.items.${n}.place`} /></p>
      : (event.date || event.place) && <p className="font-mono font-semibold text-sm uppercase tracking-[0.24em] text-berry">{[event.date, event.place].filter(Boolean).join(' · ')}</p>}<T as="h3" path={`events.items.${n}.title`} className="font-serif text-3xl leading-tight sm:text-4xl" />{(event.text || editing) && <T as="p" path={`events.items.${n}.text`} className="text-lg leading-8 text-ink/75" multiline />}</div></Item>
  })}</div><AddButton path="events.items" label="Aggiungi un evento" className="mt-12" /></div></Section>
}
function Values({ site, i }: SectionProps) {
  return <Section name="values" i={i} id={SECTION_IDS.values}><div className="mx-auto max-w-7xl"><Heading path="values" /><div className="mt-14 grid gap-8 border-t border-ink/20 pt-8 md:grid-cols-3">{site.values.items.map((_, n) => <Item key={n} path="values.items" index={n} className="flex gap-5"><T as="span" path={`values.items.${n}.num`} className="font-mono font-semibold text-base text-gold" /><div><T as="h3" path={`values.items.${n}.label`} className="max-w-[12rem] font-serif text-2xl leading-tight" /><T as="p" path={`values.items.${n}.text`} className="mt-3 max-w-xs text-sm leading-6 text-ink/65" /></div></Item>)}</div><AddButton path="values.items" label="Aggiungi un valore" className="mt-8" /></div></Section>
}
function Cta({ site, i }: SectionProps) {
  return <Section i={i}><div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div className="sm:flex-1"><T as="p" path="cta.eyebrow" className="font-mono font-semibold text-sm uppercase tracking-[0.24em] text-berry" /><T as="h2" path="cta.title" className="mt-4 whitespace-nowrap font-serif leading-[0.95] tracking-tight text-ink text-[clamp(1.5rem,5vw,4.5rem)]" /><T as="p" path="cta.text" className="mt-6 leading-7 text-ink/75" /></div><div className="flex shrink-0 flex-col items-start gap-3 sm:items-end"><SafeLink href={`mailto:${site.cta.email}`} className="inline-flex items-center gap-3 border-b border-ink pb-2 font-mono font-semibold text-sm uppercase tracking-[0.18em]"><T path="cta.linkText" bare /> <ArrowUpRight size={15} /></SafeLink><T as="span" path="cta.email" className="font-mono font-semibold text-sm uppercase tracking-[0.1em] text-ink/60" /><div className="text-ink/60"><Social site={site} hover="hover:text-berry" /></div></div></div></Section>
}

// Icone dei social nel piè di pagina; in modifica si vedono sempre e gli indirizzi si scrivono sotto.
function Social({ site, hover = 'hover:text-cream' }: { site: SiteContent; hover?: string }) {
  const { editing } = useEditor()
  const links = [{ key: 'facebook', label: 'Facebook', Icon: Facebook }, { key: 'instagram', label: 'Instagram', Icon: Instagram }] as const
  const shown = links.filter(({ key }) => editing || site.footer[key])
  if (!shown.length) return null
  return <div className="flex items-center gap-4">{shown.map(({ key, label, Icon }) => <SafeLink key={key} href={site.footer[key] || undefined} aria-label={label} title={label} target="_blank" rel="noopener noreferrer" className={`-m-2 p-2 ${hover}`}><Icon /></SafeLink>)}</div>
}

const SECTIONS: Record<string, (props: SectionProps) => React.JSX.Element> = {
  intro: Intro, story: Story, process: Process, colors: Colors, creations: Creations,
  osteria: Osteria, events: Events, values: Values,
}

// `onChange` presente → modalità modifica (usata solo da /backoffice): la pagina è controllata
// dal chiamante e testi, foto e liste diventano modificabili.
export default function OsteriaPage({ site, onChange }: { site: SiteContent; onChange?: (site: SiteContent) => void }) {
  const editing = !!onChange
  const api = useMemo<EditorApi>(() => ({
    site,
    editing,
    set: (path, value) => onChange?.(setIn(site, path, value)),
    addItem: (path, value) => {
      const list = getIn(site, path) as unknown[]
      if (list.length >= MAX_ITEMS) return
      onChange?.(setIn(site, path, [...list, value !== undefined ? value : blankLike(list[0] ?? ARRAY_ITEM_TEMPLATES[path])]))
    },
    removeItem: (path, index) => onChange?.(setIn(site, path, (getIn(site, path) as unknown[]).filter((_, n) => n !== index))),
    moveSection: (key, direction) => {
      const order = [...site.order]
      const from = order.indexOf(key)
      const to = from + direction
      if (from < 0 || to < 0 || to >= order.length) return
      ;[order[from], order[to]] = [order[to], order[from]]
      onChange?.({ ...site, order })
    },
  }), [site, editing, onChange])

  // Gli eventi compaiono solo se ce n'è almeno uno (in modifica sempre, per poterli aggiungere);
  // la posizione conta solo le sezioni visibili.
  const visible = site.order.filter(key => key in SECTIONS && (editing || key !== 'events' || site.events.items.length > 0))
  const links = visible.filter(key => key in site.nav).map(key => [site.nav[key], `#${SECTION_IDS[key]}`] as [string, string])
  return <EditorProvider value={api}><main id="top" className="overflow-hidden bg-paper text-ink">
    <Header site={site} links={links} />
    <section className="relative flex h-[92svh] min-h-[620px] items-end bg-ink text-cream"><Photo path="hero.image" altPath="hero.imageAlt" className="absolute inset-0 h-full w-full opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" /><div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 sm:px-8 sm:pb-24"><T as="p" path="kicker" className="mb-5 font-mono font-semibold text-sm uppercase tracking-[0.25em] text-cream" /><div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6"><img src={site.hero.logo} alt="" className="h-14 w-auto shrink-0 sm:h-16 lg:h-24" /><T as="h1" path="hero.title" className="whitespace-nowrap font-serif leading-[0.88] tracking-[-0.05em] text-[clamp(1.75rem,6vw,9.5rem)]" /></div><div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><T as="p" path="hero.text" className="text-base leading-7 text-cream/80 sm:flex-1 sm:text-lg" /><a href={`#${SECTION_IDS[visible[0]]}`} aria-label={site.hero.scrollAria} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cream/50 transition-colors hover:bg-cream hover:text-ink"><ArrowDown size={18} /></a></div></div></section>
    {visible.map((key, i) => { const SectionComponent = SECTIONS[key]; return <SectionComponent key={key} site={site} i={i} /> })}
    <Cta site={site} i={visible.length} />
    <section className="bg-berry px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto flex max-w-7xl justify-center"><img src={site.logoSection.image} alt={site.brand} className="h-56 w-auto sm:h-72" /></div></section>
    <footer className="bg-dark px-5 py-8 text-cream/60 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 text-xs sm:flex-row sm:items-center sm:justify-between"><T as="span" path="brand" className="font-serif text-lg text-cream" /><Social site={site} /><T as="span" path="footer.location" /><SafeLink href="#top" className="flex items-center gap-2 hover:text-cream"><T path="footer.backToTopText" bare /> <ArrowUpRight size={14} className="rotate-[-45deg]" /></SafeLink></div>{editing && <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-2 border-t border-cream/15 pt-4 font-sans text-sm sm:flex-row sm:gap-10"><span>Indirizzo Facebook: <T path="footer.facebook" className="text-cream" /></span><span>Indirizzo Instagram: <T path="footer.instagram" className="text-cream" /></span></div>}</footer>
  </main></EditorProvider>
}
