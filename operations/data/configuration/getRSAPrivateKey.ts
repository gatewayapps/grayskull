import Knex from 'knex'
import { ISetting } from '../../../foundation/types/types'

export async function getRSAPrivateKey(dataContext: Knex) {
	const result = await dataContext<ISetting>('Settings')
		.where({ key: 'RSA_PRIVATE_KEY' })
		.first()
		.select('value')

	if (result) {
		return result.value
	} else {
		return undefined
	}
}
