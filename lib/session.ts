import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import { scrypt, timingSafeEqual } from 'node:crypto'
import { SESSION_COOKIE_NAME as SESSION_COOKIE, sessionKey as key, verifyToken } from '@/lib/session-token'

const SESSION_DAYS = 7

export async function createSession() {
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key())
  ;(await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  })
}

export async function deleteSession() {
  ;(await cookies()).delete(SESSION_COOKIE)
}

// Da chiamare in OGNI azione/route protetta: il proxy da solo non basta.
export async function isAuthenticated() {
  return verifyToken((await cookies()).get(SESSION_COOKIE)?.value)
}

// Formato: scrypt:<salt hex>:<hash hex>  (generato da scripts/hash-password.mjs)
export async function checkPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH ?? ''
  const [scheme, salt, hash] = stored.split(':')
  if (scheme !== 'scrypt' || !salt || !hash) return false
  const expected = Buffer.from(hash, 'hex')
  const derived = await new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, expected.length, (err, key) => (err ? reject(err) : resolve(key))),
  )
  return timingSafeEqual(derived, expected)
}
