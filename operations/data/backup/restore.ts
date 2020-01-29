import { decrypt } from '../../../server/utils/cipher'
import { DataContext } from '../../../foundation/context/getDataContext'

export const restore = async (encryptedData: string, dataContext: DataContext) => {
  const decrypted = decrypt(encryptedData)
  if (!decrypted || typeof decrypted !== 'string') {
    throw new Error('Failed to decrypt data')
  }

  const backup = JSON.parse(decrypted)

  // Clear out old data
  await dataContext.EmailAddress.destroy({ force: true, truncate: true })
  await dataContext.UserClient.destroy({ force: true, truncate: true })
  await dataContext.Client.destroy({ force: true, truncate: true })
  await dataContext.PhoneNumber.destroy({ force: true, truncate: true })
  await dataContext.Session.destroy({ force: true, truncate: true })
  await dataContext.Setting.destroy({ force: true, truncate: true })
  await dataContext.UserClient.destroy({ force: true, truncate: true })
  await dataContext.KeyValueCache.destroy({ force: true, truncate: true })
  await dataContext.UserAccount.destroy({ force: true, truncate: true })

  await dataContext.UserAccount.bulkCreate(backup.userAccounts)
  await dataContext.EmailAddress.bulkCreate(backup.emailAddresses)
  await dataContext.Setting.bulkCreate(backup.settings)
  await dataContext.Client.bulkCreate(backup.clients)
  await dataContext.PhoneNumber.bulkCreate(backup.phoneNumbers)
  await dataContext.UserClient.bulkCreate(backup.userClients)
  await dataContext.RefreshToken.bulkCreate(backup.refreshTokens)
  await dataContext.Session.bulkCreate(backup.sessions)
}
