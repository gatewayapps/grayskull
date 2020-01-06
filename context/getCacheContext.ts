import { addSeconds } from 'date-fns'

const cache: { [key: string]: { expiresAt: number; value: any } | undefined } = {}

export interface ICacheContext {
  setValue: (key: string, value: any, ttlSeconds: number) => void
  getValue: (key: string) => any | undefined
}

export function getCacheContext(): ICacheContext {
  return {
    setValue: (key, value, ttlSeconds) =>
      (cache[key] = { expiresAt: addSeconds(new Date(), ttlSeconds).getTime(), value }),
    getValue: (key) => {
      if (cache[key] && cache[key]!.expiresAt <= new Date().getTime()) {
        cache[key] = undefined
      }
      return cache[key] ? cache[key]!.value : undefined
    }
  }
}

Object.freeze(getCacheContext)
