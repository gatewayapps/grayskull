import Knex from 'knex'
import { IPhoneNumber } from '../../../foundation/types/types'
import { v4 as uuidv4 } from 'uuid'

export async function addPrimaryPhoneNumber(userAccountId: string, phoneNumber: string, dataContext: Knex) {
	await dataContext<IPhoneNumber>('PhoneNumbers')
		.where({ userAccountId })
		.delete()

	const data: Partial<IPhoneNumber> = {
		createdAt: new Date(),
		updatedAt: new Date(),
		updatedBy: userAccountId,
		createdBy: userAccountId,
		phoneNumber,
		userAccountId,
		phoneNumberId: uuidv4(),
		primary: true,
		verified: true
	}

	await dataContext<IPhoneNumber>('PhoneNumbers').insert(data)
}
