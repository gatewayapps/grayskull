import AuthenticationService from '../../server/api/services/AuthenticationService'


import { NextApiRequest, NextApiResponse } from 'next'
import { prepareContext } from '../../context/prepareContext'

const getClientCredentialsFromRequest = (
  req: NextApiRequest
): { client_id: string; client_secret: string } | undefined => {
  if (req.headers.authorization) {
    const b64 = req.headers.authorization.replace('Basic ', '')
    const buf = Buffer.from(b64, 'base64')
    const stringContents = buf.toString('utf8')
    const authParts = stringContents.split(':')
    return {
      client_id: authParts[0],
      client_secret: authParts[1]
    }
  } else {
    if (req.body.client_id && req.body.client_secret) {
      return {
        client_id: req.body.client_id,
        client_secret: req.body.client_secret
      }
    } else {
      return undefined
    }
  }
}

const postAccessToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const context = await prepareContext(req, res)

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' })
    return
  }
  try {
    const clientCredentials = getClientCredentialsFromRequest(context.req)

    if (!req.body) {
      res.status(400).json({ success: false, message: 'Invalid request body' })
      return
    }
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body)

    if (!body || !body.grant_type || !clientCredentials) {
      res.statusCode = 400
      res.status(400).json({ success: false, message: 'Invalid request body' })
      return
    }

    const accessTokenResponse = await AuthenticationService.getAccessToken(
      body.grant_type,
      clientCredentials.client_id,
      clientCredentials.client_secret,
      body.code,
      body.refresh_token,
      context.configuration,
      {
        userContext: context.user || null
      }
    )
    res.json(accessTokenResponse)
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export default postAccessToken
