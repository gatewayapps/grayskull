import { DataContext } from '../../../foundation/context/getDataContext'

export async function clearValue(key: string, dataContext: DataContext) {
	await dataContext.KeyValueCache.destroy({ where: { key } })
}
