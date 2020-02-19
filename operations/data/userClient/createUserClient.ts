import { DataContext } from '../../../foundation/context/getDataContext'

export async function createUserClient(
  userAccountId: string,
  clientId: string,
  allowedScopes: string[],
  deniedScopes: string[],
  dataContext: DataContext
) {
  return await dataContext.UserClient.create({
    userAccountId,
    client_id: clientId,
    allowedScopes: JSON.stringify(allowedScopes),
    deniedScopes: JSON.stringify(deniedScopes),
    createdBy: userAccountId,
    createdAt: new Date()
  })
}
