import Knex from 'knex'
import { IUserClientMetadata } from '../../../foundation/types/types'

export async function setUserClientMetadata(userClientId: string, key: string, value: string, dataContext: Knex) {
	if (key.length > 50) {
		throw new Error('Metadata Keys must be 50 characters or less')
	}
	if (value.length > 500) {
		throw new Error('Metadata Values must be 500 characters or less')
	}
	if (key === '') {
		await dataContext<IUserClientMetadata>('UserClientMetadata')
			.where({ userClientId, key })
			.delete()
	} else {
		const existingRecord = await dataContext<IUserClientMetadata>('UserClientMetadata')
			.where({ userClientId, key })
			.select('*')
			.first()

		if (existingRecord) {
			await dataContext<IUserClientMetadata>('UserClientMetadata')
				.where({ userClientId, key })
				.update({ value })
		} else {
			await dataContext<IUserClientMetadata>('UserClientMetadata').insert({ userClientId, key, value })
		}
	}
}
