import { getCacheContext } from './getCacheContext'
import Knex from 'knex'
import { getCurrentConfiguration } from '../../operations/data/configuration/getCurrentConfiguration'
import { getDataContextFromConnectionString } from './getDataContext'

import { getClientRequestOptionsFromRequest } from '../../operations/logic/authentication'
import { IRequestContext } from './prepareContext'
import { getUserAccountByUserClientId } from '../../operations/data/userAccount/getUserAccountByUserClientId'
import { IUserAccount } from '../types/types'
import { createUserContextForUserId, UserContext } from './getUserContext'

export async function prepareRemoteContext(req, res): Promise<IRequestContext> {
	const cacheContext = getCacheContext()
	let dataContext = cacheContext.getValue<Knex>('DATA_CONTEXT')
	if (!dataContext) {
		dataContext = await getDataContextFromConnectionString(process.env.GRAYSKULL_DB_CONNECTION_STRING!)
		cacheContext.setValue('DATA_CONTEXT', dataContext, 600)
	}
	const configuration = await getCurrentConfiguration(dataContext, cacheContext)
	const reqContext = await getClientRequestOptionsFromRequest({
		req,
		dataContext,
		cacheContext,
		res,
		configuration,
		accessTokenType: 'client'
	})
	if (!reqContext) {
		throw new Error('Request not authorized')
	}

	let accessTokenType: 'user' | 'client' = 'user'
	if (!reqContext.userAccount && !reqContext.userClient) {
		accessTokenType = 'client'
	}
	const userClientId = req.headers['x-user-client-id']
	let userAccount: IUserAccount | undefined
	let userContext: UserContext | undefined
	if (userClientId) {
		userAccount = await getUserAccountByUserClientId(userClientId, dataContext)
		userContext = await createUserContextForUserId(
			userAccount?.userAccountId!,
			dataContext,
			cacheContext,
			configuration
		)
	}

	return {
		cacheContext,
		dataContext,
		configuration,
		req,
		res,
		accessTokenType,
		user: userContext,
		userClient: reqContext?.userClient
	}
}
