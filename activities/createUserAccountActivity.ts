import { IUserAccount } from '../foundation/types/types'
import { IRequestContext } from '../foundation/context/prepareContext'
import { createUserAccount } from '../operations/data/userAccount/createUserAccount'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'

export async function createUserAccountActivity(
  userAccountDetails: IUserAccount,
  emailAddress: string,
  context: IRequestContext
) {
  ensureAdministrator(context)
  await createUserAccount(userAccountDetails, undefined, context.dataContext, context.user)
}
