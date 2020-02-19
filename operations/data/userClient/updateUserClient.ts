import { DataContext } from '../../../foundation/context/getDataContext'

export async function updateUserClient(
  userClientId: string,
  userAccountId: string,
  allowedScopes: string[],
  deniedScopes: string[],
  dataContext: DataContext
) {
  return await dataContext.UserClient.update(
    {
      allowedScopes: JSON.stringify(allowedScopes),
      deniedScopes: JSON.stringify(deniedScopes),
      updatedAt: new Date(),
      updatedBy: userAccountId
    },
    {
      where: { userClientId },
      validate: false
    }
  )
}
