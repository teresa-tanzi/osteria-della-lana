import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Area riservata — Osteria della Lana',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-paper text-ink">{children}</div>
}
