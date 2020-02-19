import { DataContext } from '../../../foundation/context/getDataContext'
import { UserContext } from '../../../foundation/context/getUserContext'

export async function deleteUserAccount(userAccountId: string, userContext: UserContext, context: DataContext) {
  return context.UserAccount.update(
    {
      isActive: false,
      deletedAt: new Date(),
      deletedBy: userContext.userAccountId
    },
    {
      where: {
        userAccountId
      },
      validate: false
    }
  )
}
