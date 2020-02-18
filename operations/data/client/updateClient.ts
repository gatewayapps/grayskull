import { IClient } from '../../../foundation/types/types'
import { UserContext } from '../../../foundation/context/getUserContext'
import { DataContext } from '../../../foundation/context/getDataContext'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

export async function updateClient(
  clientId: string,
  values: IClient,
  userContext: UserContext | undefined,
  dataContext: DataContext
) {
  if (!userContext) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `You must be an admin to do that`)
  }
  values.updatedBy = userContext.userAccountId
  values.updatedAt = new Date()

  await dataContext.Client.update(values, { where: { client_id: clientId } })
}
