import Cookies from 'cookies'
import { getCacheContext, CacheContext } from './getCacheContext'
import { getDataContextFromConnectionString } from './getDataContext'
import { SESSION_ID_COOKIE_NAME } from '../../operations/logic/authentication'
import { getUserContext, UserContext } from './getUserContext'
import { getCurrentConfiguration } from '../../operations/data/configuration/getCurrentConfiguration'
import { IConfiguration, IUserClient } from '../types/types'
import Knex from 'knex'
import { IAccessToken } from '../types/tokens'

export interface IRequestContext {
	req: any
	res: any
	configuration: IConfiguration
	user?: UserContext
	cacheContext: CacheContext
	dataContext: Knex
	accessTokenType: 'user' | 'client'
	userClient?: IUserClient // Used for client_credentials flow
	accessToken?: IAccessToken
}

export async function prepareContext(req, res): Promise<IRequestContext> {
	const cookies = new Cookies(req, res)

	res.cookies = cookies
	req.cookies = cookies
	if (req.body) {
		req.body = typeof req.body === 'object' ? req.body : JSON.parse(req.body)
	}
	const cacheContext = getCacheContext()

	let dataContext = cacheContext.getValue<Knex>('DATA_CONTEXT')
	if (!dataContext) {
		dataContext = await getDataContextFromConnectionString(process.env.GRAYSKULL_DB_CONNECTION_STRING!)
		cacheContext.setValue('DATA_CONTEXT', dataContext, 600)
	}

	const sessionCookie = req.cookies.get(SESSION_ID_COOKIE_NAME)

	const configuration = await getCurrentConfiguration(dataContext, cacheContext)

	const userContext = await getUserContext(sessionCookie, dataContext, cacheContext, configuration)

	return {
		req,
		res,
		configuration,
		accessTokenType: 'user',
		user: userContext,
		cacheContext,
		dataContext
	}
}
