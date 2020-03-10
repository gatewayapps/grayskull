import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { getPrimaryEmailAddress } from '../operations/data/emailAddress/getPrimaryEmailAddress'

export async function getPrimaryEmailAddressForLoggedInUserActivity(context: IRequestContext) {
	ensureAuthenticated(context)
	const emailAddressRecord = await getPrimaryEmailAddress(
		context.user!.userAccountId,
		context.dataContext,
		context.cacheContext
	)
	return emailAddressRecord ? emailAddressRecord.emailAddress : null
}
