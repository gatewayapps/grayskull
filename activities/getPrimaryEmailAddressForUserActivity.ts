import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'
import { getPrimaryEmailAddress } from '../operations/data/emailAddress/getPrimaryEmailAddress'

export async function getPrimaryEmailAddressForUserActivity(userAccountId: string, context: IRequestContext) {
	ensureAdministrator(context)
	return await getPrimaryEmailAddress(userAccountId, context.dataContext, context.cacheContext)
}
