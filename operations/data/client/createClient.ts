import Knex from 'knex'
import { UserContext } from '../../../foundation/context/getUserContext'
import { v4 as uuidv4 } from 'uuid'
import { randomBytes } from 'crypto'
import { IClient } from '../../../foundation/types/types'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

export async function createClient(
	data: IClient,
	user: UserContext | undefined,
	dataContext: Knex
): Promise<IClient | undefined> {
	if (!user) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be an admin to do that')
	}

	if (!data.client_id) {
		data.client_id = uuidv4()
	}
	if (!data.secret) {
		data.secret = randomBytes(128).toString('hex')
	}

	data.createdAt = new Date()
	data.updatedAt = new Date()
	data.createdBy = user.userAccountId
	data.updatedBy = user.userAccountId

	await dataContext<IClient>('Clients').insert(data)
	return await dataContext<IClient>('Clients')
		.where({ client_id: data.client_id })
		.select('*')
		.first()
}
