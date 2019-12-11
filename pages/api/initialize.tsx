import ConfigurationManager from '../../server/config/ConfigurationManager'
import { buildContext } from '../../server/utils/authentication'
import UserAccountRepository from '../../server/data/repositories/UserAccountRepository'
import { getContext } from '../../server/data/context'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await getContext()
  const { requestContext, responseContext } = await buildContext(req, res)

  const configuration = await ConfigurationManager.GetCurrentConfiguration()
  const needsConfiguration = configuration.Server?.baseUrl !== undefined ? undefined : true
  const needsAdmin =
    (await (await UserAccountRepository.userAccountsMeta({}, { userContext: requestContext.user })).count) === 0

  res.json({
    configuration,
    needsConfiguration,
    needsAdmin,
    user: requestContext.user
  })
}
