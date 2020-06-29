import Knex from 'knex'
import { ISetting } from '../../../foundation/types/types'

export async function getRSAKeyId(dataContext: Knex) {
	const result = await dataContext<ISetting>('Settings')
		.where({ key: 'RSA_KEY_ID' })
		.first()
		.select('value')

	if (result) {
		return result.value
	} else {
		return undefined
	}
}
