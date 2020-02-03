import { DataContext } from '../../../foundation/context/getDataContext'
import { addSeconds } from 'date-fns'
import { clearValue } from './clearValue'

export async function cacheValue(key: string, value: string, ttlSeconds: number, dataContext: DataContext) {
  await clearValue(key, dataContext)
  const kvc = new dataContext.KeyValueCache({
    key,
    value,
    expires: addSeconds(new Date(), ttlSeconds)
  })

  await kvc.save()
}
