import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

// Font delle etichette (menu, sopratitoli, pulsanti): più leggibile di Courier New.
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-label', display: 'swap' })

export const metadata: Metadata = {
  title: 'Osteria della Lana — Le Beetoneghe',
  description: 'Lana, mani e relazioni dalla Valsassina. Un laboratorio artigianale e un luogo dove stare insieme.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f3efe5',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it" className={`bg-paper ${mono.variable}`}><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
