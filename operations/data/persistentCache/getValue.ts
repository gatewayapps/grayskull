import { DataContext } from '../../../foundation/context/getDataContext'
import { flushExpiredValues } from './flushExpiredValues'

export async function getValue(key: string, dataContext: DataContext) {
	await flushExpiredValues(dataContext)
	const record = await dataContext.KeyValueCache.findOne({ where: { key } })

	return record ? record.value : undefined
}
