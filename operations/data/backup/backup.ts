import { DataContext } from '../../../foundation/context/getDataContext'
import { encrypt } from '../../logic/encryption'

const BIG_LIMIT = 999999999

export const backup = async (dataContext: DataContext) => {
  const userAccounts = await dataContext.UserAccount.findAll({ limit: BIG_LIMIT })
  const clients = await dataContext.Client.findAll({ limit: BIG_LIMIT })
  const userClients = await dataContext.UserClient.findAll({ limit: BIG_LIMIT })
  const settings = await dataContext.Setting.findAll({ limit: BIG_LIMIT })
  const emailAddresses = await dataContext.EmailAddress.findAll({ limit: BIG_LIMIT })
  const refreshTokens = await dataContext.RefreshToken.findAll({ limit: BIG_LIMIT })
  const sessions = await dataContext.Session.findAll({ limit: BIG_LIMIT })
  const phoneNumbers = await dataContext.PhoneNumber.findAll({ limit: BIG_LIMIT })

  const json = JSON.stringify({
    userAccounts: userAccounts.map((x) => x.toJSON()),
    clients: clients.map((x) => x.toJSON()),
    userClients: userClients.map((x) => x.toJSON()),
    settings: settings.map((x) => x.toJSON()),
    emailAddresses: emailAddresses.map((x) => x.toJSON()),
    refreshTokens: refreshTokens.map((x) => x.toJSON()),
    sessions: sessions.map((x) => x.toJSON()),
    phoneNumbers: phoneNumbers.map((x) => x.toJSON())
  })

  const encrypted = encrypt(json)

  return encrypted
}
