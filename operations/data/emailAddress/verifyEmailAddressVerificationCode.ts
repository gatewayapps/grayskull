import { DataContext } from '../../../foundation/context/getDataContext'
import { getValue } from '../persistentCache/getValue'

export async function verifyEmailAddressVerificationCode(emailAddress: string, code: string, dataContext: DataContext) {
  const cachedRecord = await getValue(`VERIFICATION:${emailAddress}`, dataContext)
  return cachedRecord !== code
}
