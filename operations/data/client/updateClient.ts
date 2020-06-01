import { IClient } from '../../../foundation/types/types'
import { UserContext } from '../../../foundation/context/getUserContext'
import Knex from 'knex'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

export async function updateClient(
	clientId: string,
	values: IClient,
	userContext: UserContext | undefined,
	dataContext: Knex
) {
	if (!userContext) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `You must be an admin to do that`)
	}
	values.updatedBy = userContext.userAccountId
	values.updatedAt = new Date()

	await dataContext<IClient>('Clients')
		.where({ client_id: clientId })
		.update(values)
}
