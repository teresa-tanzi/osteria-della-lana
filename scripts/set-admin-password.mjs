// Chiede la password, ne calcola l'hash e lo salva direttamente su Vercel (progetto collegato),
// senza mai stamparlo né farlo copiare a mano. Uso: npm run admin:password
// Va lanciato in un terminale vero (serve per digitare la password in modo nascosto).
import { randomBytes, scryptSync } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { createInterface } from 'node:readline'

const ENVIRONMENTS = ['production', 'preview', 'development']

function ask(question) {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    rl._writeToOutput = s => { if (s.includes('\n') || s === question) process.stdout.write(s) }
    rl.question(question, answer => { rl.close(); process.stdout.write('\n'); resolve(answer) })
  })
}

const password = await ask('Nuova password (min 12 caratteri): ')
if (password.length < 12) { console.error('Troppo corta.'); process.exit(1) }
if (password !== await ask('Ripeti la password: ')) { console.error('Le due password non coincidono.'); process.exit(1) }

const salt = randomBytes(16).toString('hex')
const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`

for (const env of ENVIRONMENTS) {
  const result = spawnSync('vercel', ['env', 'add', 'ADMIN_PASSWORD_HASH', env, '--sensitive', '--force', '--yes'], {
    input: hash, encoding: 'utf8',
  })
  console.log(`${env}: ${result.status === 0 ? 'aggiornato' : 'ERRORE\n' + result.stderr + result.stdout}`)
  if (result.status !== 0) process.exit(1)
}
console.log('\nFatto. Per le anteprime già pubblicate serve un nuovo deploy perché leggano la nuova password.')
