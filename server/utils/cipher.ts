import ConfigurationManager from '../config/ConfigurationManager'
import crypto from 'crypto'

const ALGORITHM: string = 'aes-256-cbc'
const IV_LENGTH: number = 16
const KEY_LENGTH: number = 32

function getKey(): string {
  return ConfigurationManager.Security!.globalSecret.substring(0, KEY_LENGTH).padEnd(KEY_LENGTH, 'x')
}

export function encrypt(value: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(getKey()), iv)
  let encrypted = cipher.update(value)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(value: string): string | null {
  const [ivText, ...valueParts] = value.split(':')
  if (!ivText || valueParts.length === 0) {
    return null
  }
  const iv = Buffer.from(ivText, 'hex')
  const encrypted = Buffer.from(valueParts.join(''), 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(getKey()), iv)
  let decrypted = decipher.update(encrypted)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
