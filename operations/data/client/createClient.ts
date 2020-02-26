import { DataContext } from '../../../foundation/context/getDataContext'
import { UserContext } from '../../../foundation/context/getUserContext'
import uuid from 'uuid'
import { randomBytes } from 'crypto'
import { IClient } from '../../../foundation/types/types'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'
import { Client } from '../../../foundation/models/Client'

export async function createClient(
	data: IClient,
	user: UserContext | undefined,
	dataContext: DataContext
): Promise<Client | null> {
	if (!user) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be an admin to do that')
	}

	if (!data.client_id) {
		data.client_id = uuid()
	}
	if (!data.secret) {
		data.secret = randomBytes(128).toString('hex')
	}

	data.createdBy = user.userAccountId
	data.updatedBy = user.userAccountId

	return await dataContext.Client.create(data, { isNewRecord: true })
}
