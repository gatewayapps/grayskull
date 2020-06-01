import Knex from 'knex'
import { ISetting } from '../../../foundation/types/types'

type CategoryKeys = 'Server' | 'Security' | 'Mail'

export async function saveStringSetting(key: string, value: string, category: CategoryKeys, dataContext: Knex) {
	await dataContext<ISetting>('Settings')
		.where({ key })
		.delete()

	await dataContext<ISetting>('Settings').insert({ key, value, type: 'String', category })
}

export async function saveNumberSetting(key: string, value: number, category: CategoryKeys, dataContext: Knex) {
	await dataContext<ISetting>('Settings')
		.where({ key })
		.delete()

	await dataContext<ISetting>('Settings').insert({ key, value: value.toString(), type: 'Number', category })
}

export async function saveBooleanSetting(key: string, value: boolean, category: CategoryKeys, dataContext: Knex) {
	await dataContext<ISetting>('Settings')
		.where({ key })
		.delete()
	await dataContext<ISetting>('Settings').insert({ key, value: value.toString(), type: 'Boolean', category })
}
