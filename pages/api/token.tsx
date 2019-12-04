import AuthenticationService from '../../server/api/services/AuthenticationService'
import { buildContext } from '../../server/utils/authentication'
import { getContext } from '../../server/data/context'

export default async (req, res) => {
  try {
    await getContext()
    const { requestContext, responseContext } = await buildContext(req, res)

    const clientCredentials = this.getClientCredentialsFromRequest(req)
    if (!req.body || !req.body.grant_type || !clientCredentials) {
      res.status(400).json({ success: false, message: 'Invalid request body' })
      return
    }

    const accessTokenRespnse = await AuthenticationService.getAccessToken(
      req.body.grant_type,
      clientCredentials.client_id,
      clientCredentials.client_secret,
      req.body.code,
      req.body.refresh_token,
      {
        userContext: req.user || null
      }
    )
    res.json(accessTokenRespnse)
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}
