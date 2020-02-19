import { IRequestContext } from '../foundation/context/prepareContext'
import { getEmailAddressesForUserAccountId } from '../operations/data/emailAddress/getEmailAddressesForUserAccountId'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'

export async function listUserAccountEmailAddressesActivity(context: IRequestContext) {
  ensureAuthenticated(context)
  return await getEmailAddressesForUserAccountId(context.user!.userAccountId, context.dataContext)
}
