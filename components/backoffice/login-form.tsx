'use client'

import { useActionState } from 'react'
import { login } from '@/app/backoffice/actions'

const input = 'mt-2 w-full border border-ink/30 bg-white px-4 py-3 text-base outline-none focus:border-berry'

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <form action={action} className="w-full max-w-sm space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-berry">Admin</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">Accedi</h1>
      </div>
      <label className="block text-sm">Utente
        <input name="username" defaultValue={state?.username} autoComplete="username" required className={input} />
      </label>
      <label className="block text-sm">Password
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </label>
      {state?.error && <p role="alert" className="text-sm text-berry">{state.error}</p>}
      <button disabled={pending} className="w-full bg-ink px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-cream disabled:opacity-60">
        {pending ? 'Accesso…' : 'Entra'}
      </button>
    </form>
  )
}
