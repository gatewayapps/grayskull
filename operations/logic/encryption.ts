import crypto from 'crypto'
import { GRAYSKULL_GLOBAL_SECRET } from '../../server/utils/environment'

const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16
const KEY_LENGTH = 32

function getKey(): string {
  return GRAYSKULL_GLOBAL_SECRET.substring(0, KEY_LENGTH).padEnd(KEY_LENGTH, 'x')
}

function doEncrypt(value: string, key: string) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv)
  let encrypted = cipher.update(value)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function doDecrypt(value: string, key: string) {
  const [ivText, ...valueParts] = value.split(':')
  if (!ivText || valueParts.length === 0) {
    return null
  }
  const iv = Buffer.from(ivText, 'hex')
  const encrypted = Buffer.from(valueParts.join(''), 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv)
  let decrypted = decipher.update(encrypted)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

export function encrypt(value: string): string {
  return doEncrypt(value, getKey())
}

export function decrypt(value: string): string | null {
  return doDecrypt(value, getKey())
}
