import { config } from 'dotenv'
if (config && typeof config === 'function') {
  config()
}

export const GRAYSKULL_GLOBAL_SECRET = process.env.GRAYSKULL_GLOBAL_SECRET || 'ABCDEFG1234567'
export const GRAYSKULL_DB_CONNECTION_STRING = process.env.GRAYSKULL_DB_CONNECTION_STRING!
export const GRAYSKULL_DB_PROVIDER = process.env.GRAYSKULL_DB_PROVIDER!
export const GRAYSKULL_DB_HOST = process.env.GRAYSKULL_DB_HOST!
export const GRAYSKULL_DB_LOGIN = process.env.GRAYSKULL_DB_LOGIN!
export const GRAYSKULL_DB_PASSWORD = process.env.GRAYSKULL_DB_PASSWORD!
export const GRAYSKULL_DB_STORAGE = process.env.GRAYSKULL_DB_STORAGE!
