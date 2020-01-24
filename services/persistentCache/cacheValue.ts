import { DataContext } from '../../context/getDataContext'
import { addSeconds } from 'date-fns'

export async function cacheValue(key: string, value: string, ttlSeconds: number, dataContext: DataContext) {
  const [kvc] = await dataContext.KeyValueCache.findOrBuild({ where: { key } })
  kvc.value = value
  kvc.expires = addSeconds(new Date(), ttlSeconds)
  await kvc.save()
}
