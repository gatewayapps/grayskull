import { IRequestContext } from '../foundation/context/prepareContext'
import { isEmailAddressAvailable } from '../operations/data/emailAddress/isEmailAddressAvailable'

export async function isEmailAddressAvailableActivity(emailAddress: string, context: IRequestContext) {
  return await isEmailAddressAvailable(emailAddress, context.dataContext)
}
