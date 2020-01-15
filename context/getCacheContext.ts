/* eslint-disable @typescript-eslint/no-explicit-any */
import { addSeconds } from 'date-fns'

const cache: { [key: string]: { expiresAt: number; value: any } } = {}

export interface CacheContext {
  setValue: (key: string, value: any, ttlSeconds: number) => void
  getValue: <T = any>(key: string) => T | undefined
  clearValue: (key: string) => void
}

export function getCacheContext(): CacheContext {
  return {
    setValue: (key, value, ttlSeconds) => {
      if (key === '') {
        throw new Error('Invalid cache key')
      } else {
        cache[key] = { expiresAt: addSeconds(new Date(), ttlSeconds).getTime(), value }
      }
    },
    getValue: <T = any>(key) => {
      if (key === '') {
        throw new Error('Invalid cache key')
      }
      if (!cache[key]) {
        return undefined
      }
      if (cache[key] && cache[key].expiresAt <= new Date().getTime()) {
        delete cache[key]
      }
      return cache[key] ? (cache[key].value as T) : undefined
    },
    clearValue: (key) => {
      delete cache[key]
    }
  }
}

Object.freeze(getCacheContext)
