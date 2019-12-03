import { getCurrentConfiguration } from '../../server/config/ConfigurationManager'
import { buildContext } from '../../server/utils/authentication'
import UserAccountRepository from '../../server/data/repositories/UserAccountRepository'
import { getContext } from '../../server/data/context'

export default async (req, res) => {
  await getContext()
  const { requestContext, responseContext } = await buildContext(req, res)

  const configuration = await getCurrentConfiguration()
  const needsConfiguration = configuration.Server?.baseUrl ? undefined : true
  const needsAdmin =
    (await (await UserAccountRepository.userAccountsMeta({}, { userContext: requestContext.user })).count) === 0

  res.json({
    configuration,
    needsConfiguration,
    needsAdmin,
    user: requestContext.user
  })
}
