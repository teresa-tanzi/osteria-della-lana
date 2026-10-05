import { neon } from '@neondatabase/serverless'

// Creato a ogni chiamata (è solo un wrapper HTTP): niente connessione a import-time,
// così `next build` non fallisce se DATABASE_URL non è ancora configurata.
export function sql() {
  return neon(process.env.DATABASE_URL!)
}
