'use server'

import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { conform, type SiteContent } from '@/lib/content-schema'
import { saveContent } from '@/lib/content'
import { site } from '@/lib/data'
import { checkPassword, createSession, deleteSession, isAuthenticated } from '@/lib/session'
import { clearFailures, recordFailure, tooManyAttempts } from '@/lib/throttle'

function sameString(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export async function login(_state: { error?: string; username?: string } | undefined, formData: FormData) {
  const username = String(formData.get('username') ?? '')
  if (await tooManyAttempts()) return { error: 'Troppi tentativi. Riprova tra qualche minuto.', username }
  const password = String(formData.get('password') ?? '')
  // Entrambi i controlli vengono sempre eseguiti, per non rivelare quale dei due è sbagliato.
  const userOk = sameString(username, process.env.ADMIN_USERNAME ?? '')
  const passOk = await checkPassword(password)

  if (!userOk || !passOk) {
    await recordFailure()
    return { error: 'Credenziali non valide.', username }
  }
  await clearFailures()
  await createSession()
  redirect('/backoffice')
}

export async function logout() {
  await deleteSession()
  redirect('/backoffice/login')
}

export async function save(data: unknown): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthenticated())) return { ok: false, error: 'Sessione scaduta: effettua di nuovo il login.' }
  try {
    // Nav e etichette di accessibilità non sono modificabili da /backoffice: restano quelle di default.
    const content: SiteContent = { ...conform(site, data), nav: site.nav, header: site.header }
    await saveContent(content)
    revalidatePath('/')
    return { ok: true }
  } catch (error) {
    console.error('Salvataggio fallito', error)
    return { ok: false, error: 'Salvataggio non riuscito. Riprova.' }
  }
}
