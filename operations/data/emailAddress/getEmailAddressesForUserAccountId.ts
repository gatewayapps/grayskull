import { DataContext } from '../../../foundation/context/getDataContext'

export async function getEmailAddressesForUserAccountId(userAccountId: string, context: DataContext) {
  return context.EmailAddress.findAll({ where: { userAccountId } })
}
