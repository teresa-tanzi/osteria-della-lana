// Genera ADMIN_PASSWORD_HASH. Uso: npm run admin:hash   (la password si digita, non resta nella history)
import { randomBytes, scryptSync } from 'node:crypto'
import { createInterface } from 'node:readline'

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
rl._writeToOutput = s => { if (s.includes('\n') || s.startsWith('Password')) process.stdout.write(s) }
rl.question('Password (min 12 caratteri): ', password => {
  rl.close()
  if (password.length < 12) { console.error('\nTroppo corta.'); process.exit(1) }
  const salt = randomBytes(16).toString('hex')
  console.log(`\nADMIN_PASSWORD_HASH=scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`)
})
