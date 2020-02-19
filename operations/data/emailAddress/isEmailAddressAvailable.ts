import { DataContext } from '../../../foundation/context/getDataContext'

export async function isEmailAddressAvailable(emailAddress: string, context: DataContext) {
  const emailAddressRecord = await context.EmailAddress.findOne({ where: { emailAddress } })
  return !!!emailAddressRecord
}
