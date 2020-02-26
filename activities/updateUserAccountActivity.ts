import { IUserAccount } from '../foundation/types/types'
import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'
import { updateUserAccount } from '../operations/data/userAccount/updateUserAccount'

export async function updateUserAccountActivity(
	userAccountId: string,
	userDetails: IUserAccount,
	context: IRequestContext
) {
	ensureAuthenticated(context)
	if (userAccountId !== context.user!.userAccountId || userDetails.permissions !== undefined) {
		ensureAdministrator(context)
	}

	await updateUserAccount(userAccountId, userDetails, context.dataContext, context.user!, context.cacheContext)
}
