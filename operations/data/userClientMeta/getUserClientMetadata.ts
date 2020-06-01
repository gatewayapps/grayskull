import Knex from 'knex'
import { IUserClientMetadata } from '../../../foundation/types/types'

export async function getUserClientMetadata(userClientId: string, dataContext: Knex) {
	return dataContext<IUserClientMetadata>('UserClientMetadata')
		.where({ userClientId })
		.select('key', 'value')
}
