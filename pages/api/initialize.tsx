import UserAccountRepository from '../../server/data/repositories/UserAccountRepository'

import { NextApiRequest, NextApiResponse } from 'next'

import ClientRepository from '../../server/data/repositories/ClientRepository'
import { prepareContext } from '../../context/prepareContext'
import { PASSWORD_PLACEHOLDER } from '../../server/constants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const context = await prepareContext(req, res)

  const configuration = context.configuration

  configuration.Mail.password = PASSWORD_PLACEHOLDER
  configuration.Mail.sendgridApiKey = PASSWORD_PLACEHOLDER

  const pinnedClients = await ClientRepository.getClients({ pinToHeader_equals: true }, { userContext: null })

  configuration.HeaderItems = pinnedClients
  const needsConfiguration = !configuration.Server?.baseUrl

  const needsAdmin = (await (await UserAccountRepository.userAccountsMeta({}, { userContext: null })).count) === 0

  res.json({
    configuration,
    needsConfiguration,
    needsAdmin,
    user: context.user
      ? {
          userAccountId: context.user.userAccountId,
          firstName: context.user.firstName,
          lastName: context.user.lastName,
          gender: context.user.gender,
          birthday: context.user.birthday,
          lastPasswordChange: context.user.lastPasswordChange,
          permissions: context.user.permissions,
          otpEnabled: context.user.otpEnabled
        }
      : undefined
  })
}
