'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUpRight, Menu, X } from 'lucide-react'
import type { SiteContent } from '@/lib/content-schema'

// Layout in base alla posizione (1ª, 2ª, 3ª… tra le sezioni visibili), non alla sezione:
// posizioni dispari → foto a sinistra e sfondo chiaro, pari → foto a destra e sfondo crema.
const photoLeft = (i: number) => i % 2 === 0
const tone = (i: number) => (i % 2 === 0 ? '' : 'bg-cream')
const pad = 'px-5 py-24 sm:px-8 sm:py-32'

// Ancora di ogni sezione riordinabile (usata da menu e freccia della prima schermata).
const SECTION_IDS: Record<string, string> = {
  intro: 'beetoneghe', story: 'filo', process: 'lana', colors: 'colori',
  creations: 'creazioni', osteria: 'osteria', events: 'eventi', values: 'valori',
}

function Img({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <div className={`group overflow-hidden ${className}`}><img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
}
function Heading({ eyebrow, title, className = '' }: { eyebrow: string; title: string; className?: string }) {
  return <div className={`space-y-4 ${className}`}><p className="font-mono text-xs uppercase tracking-[0.24em] text-berry">{eyebrow}</p><h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl">{title}</h2></div>
}
function Header({ site, links }: { site: SiteContent; links: [string, string][] }) {
  const [open, setOpen] = useState(false)
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/20 bg-ink/85 text-cream backdrop-blur-md"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><a href="#top" className="font-serif text-xl tracking-tight">{site.brand}</a><nav className="hidden gap-5 lg:flex">{links.map(([label, href]) => <a key={href} href={href} className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.08em] text-cream/80 transition-colors hover:text-gold">{label}</a>)}</nav><button className="lg:hidden" aria-label={open ? site.header.closeMenuAria : site.header.openMenuAria} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div>{open && <nav className="flex flex-col gap-5 border-t border-cream/15 bg-ink px-5 py-6 lg:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="font-mono text-sm uppercase tracking-[0.15em]">{label}</a>)}</nav>}</header>
}
function PageImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) { return <Img src={src} alt={alt} className={className.includes('absolute') ? className : `relative ${className}`} /> }

type SectionProps = { site: SiteContent; i: number }

function Intro({ site, i }: SectionProps) {
  const left = photoLeft(i)
  return <section id={SECTION_IDS.intro} className={`${tone(i)} ${pad}`}><div className={`mx-auto grid max-w-7xl gap-12 lg:gap-24 ${left ? 'lg:grid-cols-[0.8fr_1.2fr]' : 'lg:grid-cols-[1.2fr_0.8fr]'}`}><Heading eyebrow={site.intro.eyebrow} title={site.intro.title} className={left ? '' : 'lg:order-2'} /><div className={`space-y-8 text-lg leading-8 text-ink/75 ${left ? '' : 'lg:order-1'}`}><div className="space-y-5">{site.intro.paragraphs.map(p => <p key={p}>{p}</p>)}</div><blockquote className="border-l-2 border-berry pl-5 font-serif text-3xl leading-tight text-berry">{site.intro.quote}</blockquote></div></div></section>
}
function Story({ site, i }: SectionProps) {
  const left = photoLeft(i)
  return <section id={SECTION_IDS.story} className={`${tone(i)} ${pad}`}><div className={`mx-auto grid max-w-7xl gap-10 lg:items-center lg:gap-24 ${left ? 'lg:grid-cols-[1.1fr_0.9fr]' : 'lg:grid-cols-[0.9fr_1.1fr]'}`}><PageImage src={site.story.image} alt={site.story.imageAlt} className={`aspect-[4/5] ${left ? '' : 'lg:order-2'}`} /><div className={`space-y-7 ${left ? '' : 'lg:order-1'}`}><Heading eyebrow={site.story.eyebrow} title={site.story.title} /><div className="max-w-lg space-y-5 text-lg leading-8 text-ink/75">{site.story.text.map(p => <p key={p}>{p}</p>)}</div><a href="#creazioni" className="inline-flex items-center gap-3 border-b border-ink pb-2 font-mono text-xs uppercase tracking-[0.18em]">{site.story.linkText} <ArrowUpRight size={15} /></a></div></div></section>
}
function Process({ site, i }: SectionProps) {
  return <section id={SECTION_IDS.process} className={`${tone(i)} ${pad}`}><div className="mx-auto max-w-7xl"><Heading eyebrow={site.process.eyebrow} title={site.process.title} /><p className="mt-6 text-lg leading-8 text-ink/75">{site.process.intro}</p><div className="mt-14 grid gap-8 md:grid-cols-3">{site.process.items.map((item, n) => <article key={item.title}><PageImage src={item.image} alt={item.title} className="aspect-[4/5]" /><div className="flex gap-5 pt-5"><span className="font-mono text-sm text-berry">{n + 1}</span><div><h3 className="font-serif text-2xl">{item.title}</h3><p className="mt-3 text-sm leading-6 text-ink/65">{item.text}</p></div></div></article>)}</div></div></section>
}
function Colors({ site, i }: SectionProps) {
  const left = photoLeft(i)
  return <section id={SECTION_IDS.colors} className={`${tone(i)} ${pad}`}><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-24"><div className={`order-2 space-y-7 ${left ? 'lg:order-2' : 'lg:order-1'}`}><Heading eyebrow={site.colors.eyebrow} title={site.colors.title} /><div className="max-w-md space-y-5 text-lg leading-8 text-ink/75">{site.colors.text.map(p => <p key={p}>{p}</p>)}</div><blockquote className="border-l-2 border-berry pl-5 font-serif text-3xl leading-tight text-berry">{site.colors.quote}</blockquote><div className="flex gap-2 pt-2">{site.colors.swatches.map(color => <i key={color} className="h-10 w-10 rounded-full" style={{ backgroundColor: color }} />)}</div></div><PageImage src={site.colors.image} alt={site.colors.imageAlt} className={`order-1 aspect-square ${left ? 'lg:order-1' : 'lg:order-2'}`} /></div></section>
}
function Creations({ site, i }: SectionProps) {
  return <section id={SECTION_IDS.creations} className={`${tone(i)} ${pad}`}><div className="mx-auto max-w-7xl"><Heading eyebrow={site.creations.eyebrow} title={site.creations.title} /><p className="mt-6 text-lg leading-8 text-ink/75">{site.creations.intro}</p><div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6"><article className="col-span-2"><PageImage src={site.creations.items[0].image} alt={site.creations.items[0].title} className="aspect-[16/8]" /></article>{site.creations.items.slice(1).map(({ title, image }) => <article key={title}><PageImage src={image} alt={title} className="aspect-square" /></article>)}</div></div></section>
}
function Osteria({ site, i }: SectionProps) {
  return <section id={SECTION_IDS.osteria} className={`${tone(i)} ${pad}`}><div className="mx-auto max-w-7xl"><Heading eyebrow={site.osteria.eyebrow} title={site.osteria.title} /><div className="mt-6 space-y-5 text-lg leading-8 text-ink/75">{site.osteria.text.map(p => <p key={p}>{p}</p>)}</div><PageImage src={site.osteria.image} alt={site.osteria.imageAlt} className="mt-14 aspect-[16/9]" /></div></section>
}
function Events({ site, i }: SectionProps) {
  const { events } = site
  return <section id={SECTION_IDS.events} className={`${tone(i)} ${pad}`}><div className="mx-auto max-w-7xl"><Heading eyebrow={events.eyebrow} title={events.title} />{events.intro && <p className="mt-6 text-lg leading-8 text-ink/75">{events.intro}</p>}<div className="mt-14 space-y-16 sm:space-y-24">{events.items.map((event, n) => {
    // Le foto degli eventi continuano ad alternarsi, a partire dal lato della sezione;
    // gli eventi senza foto non occupano un turno.
    const left = photoLeft(i + events.items.slice(0, n).filter(e => e.image).length)
    return <article key={n} className={event.image ? 'grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-24' : 'max-w-2xl'}>{event.image && <PageImage src={event.image} alt={event.imageAlt || event.title} className={`aspect-[4/3] ${left ? '' : 'lg:order-2'}`} />}<div className={`space-y-4 ${left ? '' : 'lg:order-1'}`}>{(event.date || event.place) && <p className="font-mono text-xs uppercase tracking-[0.24em] text-berry">{[event.date, event.place].filter(Boolean).join(' · ')}</p>}<h3 className="font-serif text-3xl leading-tight sm:text-4xl">{event.title}</h3>{event.text && <p className="whitespace-pre-line text-lg leading-8 text-ink/75">{event.text}</p>}</div></article>
  })}</div></div></section>
}
function Values({ site, i }: SectionProps) {
  return <section id={SECTION_IDS.values} className={`${tone(i)} ${pad}`}><div className="mx-auto max-w-7xl"><Heading eyebrow={site.values.eyebrow} title={site.values.title} /><div className="mt-14 grid gap-8 border-t border-ink/20 pt-8 md:grid-cols-3">{site.values.items.map(item => <div key={item.num} className="flex gap-5"><span className="font-mono text-sm text-gold">{item.num}</span><div><h3 className="max-w-[12rem] font-serif text-2xl leading-tight">{item.label}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-ink/65">{item.text}</p></div></div>)}</div></div></section>
}
function Cta({ site, i }: SectionProps) {
  return <section className={`${tone(i)} ${pad}`}><div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div className="sm:flex-1"><p className="font-mono text-xs uppercase tracking-[0.24em] text-berry">{site.cta.eyebrow}</p><h2 className="mt-4 whitespace-nowrap font-serif leading-[0.95] tracking-tight text-ink text-[clamp(1.5rem,5vw,4.5rem)]">{site.cta.title}</h2><p className="mt-6 leading-7 text-ink/75">{site.cta.text}</p></div><div className="flex shrink-0 flex-col items-start gap-3 sm:items-end"><a href={`mailto:${site.cta.email}`} className="inline-flex items-center gap-3 border-b border-ink pb-2 font-mono text-xs uppercase tracking-[0.18em]">{site.cta.linkText} <ArrowUpRight size={15} /></a><span className="font-mono text-xs uppercase tracking-[0.1em] text-ink/60">{site.cta.email}</span></div></div></section>
}

const SECTIONS: Record<string, (props: SectionProps) => React.JSX.Element> = {
  intro: Intro, story: Story, process: Process, colors: Colors, creations: Creations,
  osteria: Osteria, events: Events, values: Values,
}

export default function OsteriaPage({ site }: { site: SiteContent }) {
  // Gli eventi compaiono solo se ce n'è almeno uno; la posizione conta solo le sezioni visibili.
  const visible = site.order.filter(key => key in SECTIONS && (key !== 'events' || site.events.items.length > 0))
  const links = visible.filter(key => key in site.nav).map(key => [site.nav[key], `#${SECTION_IDS[key]}`] as [string, string])
  return <main id="top" className="overflow-hidden bg-paper text-ink">
    <Header site={site} links={links} />
    <section className="relative flex h-[92svh] min-h-[620px] items-end bg-ink text-cream"><PageImage src={site.hero.image} alt={site.hero.imageAlt} className="absolute inset-0 h-full w-full opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" /><div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 sm:px-8 sm:pb-24"><p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-cream">{site.kicker}</p><div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6"><img src={site.hero.logo} alt="" className="h-14 w-auto shrink-0 sm:h-16 lg:h-24" /><h1 className="whitespace-nowrap font-serif leading-[0.88] tracking-[-0.05em] text-[clamp(1.75rem,6vw,9.5rem)]">{site.hero.title}</h1></div><div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><p className="text-base leading-7 text-cream/80 sm:flex-1 sm:text-lg">{site.hero.text}</p><a href={`#${SECTION_IDS[visible[0]]}`} aria-label={site.hero.scrollAria} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cream/50 transition-colors hover:bg-cream hover:text-ink"><ArrowDown size={18} /></a></div></div></section>
    {visible.map((key, i) => { const Section = SECTIONS[key]; return <Section key={key} site={site} i={i} /> })}
    <Cta site={site} i={visible.length} />
    <section className="bg-berry px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto flex max-w-7xl justify-center"><img src={site.logoSection.image} alt={site.brand} className="h-56 w-auto sm:h-72" /></div></section>
    <footer className="bg-dark px-5 py-8 text-cream/60 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 text-xs sm:flex-row sm:items-center sm:justify-between"><span className="font-serif text-lg text-cream">{site.brand}</span><span>{site.footer.location}</span><a href="#top" className="flex items-center gap-2 hover:text-cream">{site.footer.backToTopText} <ArrowUpRight size={14} className="rotate-[-45deg]" /></a></div></footer>
  </main>
}
