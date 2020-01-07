import { DataContext } from './getDataContext'
import { CacheContext } from './getCacheContext'
import { Session } from '../server/data/models/Session'

/**
 * @description Attempts to find a matching session in the cache context.  If no session is cached, find it in the data context and cache it
 * @param sessionId
 * @param fingerprint
 * @param dataContext
 * @param cacheContext
 */
export async function getSession(
  sessionId: string,
  fingerprint: string,
  dataContext: DataContext,
  cacheContext: CacheContext
): Promise<Session | undefined> {
  const cacheKey = `SESSION_${sessionId}`
  const cachedSession = cacheContext.getValue<Session>(cacheKey)
  if (cachedSession && cachedSession.fingerprint === fingerprint) {
    return cachedSession
  }

  const session = await dataContext.Session.findOne({ where: { fingerprint, sessionId } })
  if (session) {
    cacheContext.setValue(cacheKey, session, 30)
  }

  return session
}

export async function getUserContext(
  sessionId: string,
  fingerprint: string,
  dataContext: DataContext,
  cacheContext: CacheContext
) {
  const session = await getSession(sessionId, fingerprint, dataContext, cacheContext)
  if (!session) {
    return undefined
  }

  const cacheKey = `USER_${session.userAccountId}`
}
