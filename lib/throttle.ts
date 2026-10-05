import { headers } from 'next/headers'
import { sql } from '@/lib/db'

const MAX_FAILURES = 5
const WINDOW_MINUTES = 15

async function clientIp() {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
}

export async function tooManyAttempts() {
  const ip = await clientIp()
  const rows = await sql()`
    SELECT count(*)::int AS n FROM login_attempts
    WHERE ip = ${ip} AND at > now() - make_interval(mins => ${WINDOW_MINUTES})`
  return rows[0].n >= MAX_FAILURES
}

export async function recordFailure() {
  const ip = await clientIp()
  await sql()`INSERT INTO login_attempts (ip) VALUES (${ip})`
  await sql()`DELETE FROM login_attempts WHERE at < now() - interval '1 day'`
}

export async function clearFailures() {
  await sql()`DELETE FROM login_attempts WHERE ip = ${await clientIp()}`
}
