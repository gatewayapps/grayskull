import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullErrorCode, GrayskullError } from '../foundation/errors/GrayskullError'
import { createEmailAddress } from '../operations/data/emailAddress/createEmailAddress'

export async function addEmailAddress(emailAddress: string, context: IRequestContext) {
  if (!context.user) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be signed in to do that')
  }

  await createEmailAddress(emailAddress, context.user.userAccountId, context.dataContext, false, false)
}
