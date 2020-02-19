import { DataContext } from '../../../foundation/context/getDataContext'
import { UserContext } from '../../../foundation/context/getUserContext'
import { IUserAccount } from '../../../foundation/types/types'

export async function updateUserAccount(
  userAccountId,
  userAccountDetails: IUserAccount,
  context: DataContext,
  userContext: UserContext
) {
  return await context.UserAccount.update(
    {
      ...userAccountDetails,
      updatedAt: new Date(),
      updatedBy: userContext.userAccountId
    },
    { where: { userAccountId }, validate: false }
  )
}
