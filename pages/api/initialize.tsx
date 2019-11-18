import { getCurrentConfiguration } from '../../server/config/ConfigurationManager'
import { buildContext } from '../../server/utils/authentication'

export default async (req, res) => {
  const { requestContext, responseContext } = await buildContext(req, res)

  const configuration = await getCurrentConfiguration()
  res.json({
    configuration,
    user: requestContext.user
  })
}
