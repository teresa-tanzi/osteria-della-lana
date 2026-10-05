// Crea le tabelle (idempotente). Uso: npm run db:setup
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL)

await sql`CREATE TABLE IF NOT EXISTS site_content (
  id int PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
)`
await sql`CREATE TABLE IF NOT EXISTS login_attempts (
  id bigserial PRIMARY KEY,
  ip text NOT NULL,
  at timestamptz NOT NULL DEFAULT now()
)`
await sql`CREATE INDEX IF NOT EXISTS login_attempts_ip_at ON login_attempts (ip, at)`
console.log('Tabelle pronte.')
