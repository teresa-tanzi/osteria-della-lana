import { jwtVerify } from 'jose'

// Parte condivisa (senza 'server-only' e senza next/headers) usabile anche dal proxy.
export const SESSION_COOKIE_NAME = 'backoffice_session'

export function sessionKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET mancante o troppo corta (min 32 caratteri)')
  return new TextEncoder().encode(secret)
}

export async function verifyToken(token: string | undefined) {
  if (!token) return false
  try {
    await jwtVerify(token, sessionKey(), { algorithms: ['HS256'] })
    return true
  } catch {
    return false
  }
}
