import { IRequestContext } from '../foundation/context/prepareContext'
import { getEmailAddressesForUserAccountId } from '../operations/data/emailAddress/getEmailAddressesForUserAccountId'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'
import { IEmailAddress } from '../foundation/types/types'

export async function listUserAccountEmailAddressesActivity(
	userAccountId: string | undefined,
	context: IRequestContext
): Promise<IEmailAddress[]> {
	ensureAuthenticated(context)
	if (userAccountId && userAccountId !== context.user!.userAccountId) {
		ensureAdministrator(context)
	}
	return await getEmailAddressesForUserAccountId(userAccountId || context.user!.userAccountId, context.dataContext)
}
