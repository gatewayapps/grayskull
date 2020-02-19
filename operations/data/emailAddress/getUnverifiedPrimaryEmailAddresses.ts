import { DataContext } from '../../../foundation/context/getDataContext'

export async function getUnverifiedPrimaryEmailAddresses(dataContext: DataContext) {
  return dataContext.EmailAddress.findAll({
    where: {
      primary: true,
      verified: false
    }
  })
}
