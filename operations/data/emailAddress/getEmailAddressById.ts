import { DataContext } from '../../../foundation/context/getDataContext'

export async function getEmailAddressById(emailAddressId: string, dataContext: DataContext) {
  return dataContext.EmailAddress.findOne({
    where: {
      emailAddressId
    }
  })
}
