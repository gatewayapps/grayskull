import Knex from 'knex'
import { ISetting } from '../../../foundation/types/types'

export async function getRSAPublicKey(dataContext: Knex) {
	const result = await dataContext<ISetting>('Settings')
		.where({ key: 'RSA_PUBLIC_KEY' })
		.first()
		.select('value')

	if (result) {
		return result.value
	} else {
		return undefined
	}
}
