import Cookies from 'cookies'
import { getCacheContext, CacheContext } from './getCacheContext'
import { getDataContextFromConnectionString, DataContext } from './getDataContext'
import { SESSION_ID_COOKIE_NAME } from '../server/utils/authentication'
import { getUserContext } from './getUserContext'
import { getCurrentConfiguration } from '../services/configuration/getCurrentConfiguration'
import { IConfiguration } from '../data/types'

export interface IRequestContext {
  req: any
  res: any
  configuration: IConfiguration
  user: any
  cacheContext: CacheContext
  dataContext: DataContext
}

export async function prepareContext(req, res): Promise<IRequestContext> {
  const cookies = new Cookies(req, res)

  res.cookies = cookies
  req.cookies = cookies

  const cacheContext = getCacheContext()

  let dataContext = cacheContext.getValue<DataContext>('DATA_CONTEXT')
  if (!dataContext) {
    dataContext = await getDataContextFromConnectionString(process.env.GRAYSKULL_DB_CONNECTION_STRING!)
    cacheContext.setValue('DATA_CONTEXT', dataContext, 600)
  }

  const sessionCookie = req.cookies.get(SESSION_ID_COOKIE_NAME)
  const fingerprint = req.headers['x-fingerprint']

  const configuration = await getCurrentConfiguration(dataContext, cacheContext)

  const userContext = await getUserContext(sessionCookie, fingerprint, dataContext, cacheContext)
  const finalUserContext = userContext
    ? {
        ...userContext.userAccount,
        emailAddress: userContext.primaryEmailAddress
      }
    : undefined

  return {
    req,
    res,
    configuration,
    user: finalUserContext,
    cacheContext,
    dataContext
  }
}
