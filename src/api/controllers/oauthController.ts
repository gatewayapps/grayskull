import ConfigurationManager from '@/config/ConfigurationManager'
import { query, queryMustEqual } from '@decorators/paramDecorator'
import { HttpMethod, route } from '@decorators/routeDecorator'
import AuthenticationService from '@services/AuthenticationService'
import UserAccountService from '@services/UserAccountService'
import { Request, Response } from 'express'
import ControllerBase from './ControllerBase'
import { setAuthCookies, decodeState, clearAuthCookies, getAuthCookies } from '@/utils/authentication'
import SessionService from '@services/SessionService'
import '../../middleware/authentication'
import CertificateService from '@services/CertificateService'

export default class OAuthController extends ControllerBase {
  @route(HttpMethod.POST, '/token')
  public async postAccessToken(req: Request, res: Response) {
    try {
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
        { userContext: req.user || null }
      )
      res.json(accessTokenRespnse)
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  }

  private getClientCredentialsFromRequest(req: Request): { client_id: string; client_secret: string } | undefined {
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
}
