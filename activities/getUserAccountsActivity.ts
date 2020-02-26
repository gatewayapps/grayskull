import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'
import { getUserAccounts } from '../operations/data/userAccount/getUserAccounts'

export async function getUserAccountsActivity(context: IRequestContext) {
	ensureAdministrator(context)
	return await getUserAccounts(context.dataContext)
}
