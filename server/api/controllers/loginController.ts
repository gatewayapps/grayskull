import ConfigurationManager from '../../config/ConfigurationManager'
import { query, queryMustEqual } from '../../decorators/paramDecorator'
import { HttpMethod, route } from '../../decorators/routeDecorator'
import AuthenticationService from '../../api/services/AuthenticationService'
import UserAccountService from '../../api/services/UserAccountService'
import { Request, Response } from 'express'
import ControllerBase from './ControllerBase'
import { decodeState, clearAuthCookies, getAuthCookies } from '../../utils/authentication'
import SessionService from '../../api/services/SessionService'
import '../../middleware/authentication'
import CertificateService from '../../api/services/CertificateService'
import ClientRepository from '../../data/repositories/ClientRepository'

export default class LoginController extends ControllerBase {
  @route(HttpMethod.GET, '/jwks')
  public async getJWKS(req: Request, res: Response) {
    const jwks = CertificateService.getJWKS()
    res.json({ keys: [jwks] })
  }

  @route(HttpMethod.GET, '/logout')
  public async logout(req: Request, res: Response) {
    const { sessionId } = getAuthCookies(req)
    if (sessionId) {
      await SessionService.deleteSession({ sessionId }, { userContext: req.user || null })
    }
    clearAuthCookies(res)

    let redirectUrl = `/login${req.query.state ? `?state=${encodeURIComponent(req.query.state)}` : ''}`

    if (req.query.client_id) {
      const client = await ClientRepository.getClient({ client_id: req.query.client_id }, { userContext: null })
      if (client && client.homePageUrl) {
        redirectUrl = client.homePageUrl
      }
    }

    res.redirect(redirectUrl)
  }

  @route(HttpMethod.GET, '/resetPassword')
  public async renderResetPassword(req: Request, res: Response) {
    return this.next.render(req, res, '/resetPassword', req.query)
  }

  @route(HttpMethod.GET, '/changePassword')
  public async renderChangePassword(req: Request, res: Response) {
    const { emailAddress, token } = req.query
    if (!emailAddress || !token) {
      res.locals.error = { message: 'Missing email address or token' }
      return this.next.render(req, res, '/error', req.query)
    } else {
      const isValid = await UserAccountService.validateResetPasswordToken(emailAddress, token, { userContext: null })
      if (isValid) {
        return this.next.render(req, res, '/resetPassword/changePassword', req.query)
      } else {
        res.locals.error = { message: 'Invalid email address or token' }
        return this.next.render(req, res, '/error', req.query)
      }
    }
  }

  @route(HttpMethod.GET, '/signin')
  @query('code')
  public async getSignin(req: Request, res: Response) {
    try {
      const state = decodeState(req.query.state)
      const returnPath = state && state.returnPath ? state.returnPath : '/'
      res.redirect(returnPath)
    } catch (err) {
      console.error(err)
      res.locals.error = { message: err.message }
      return this.renderLoginPage(req, res)
    }
  }

  @route(HttpMethod.GET, '/authorize')
  @query('client_id', 'response_type', 'redirect_uri')
  public async renderLoginPage(req: Request, res: Response) {
    if ((await this.validateLoginRequest(req)) === false) {
      res.status(400).send()
      return
    } else {
      return this.next.render(req, res, '/authorize', req.query)
    }
  }

  private async validateLoginRequest(req: Request): Promise<boolean> {
    return await AuthenticationService.validateRedirectUri(req.query.client_id, req.query.redirect_uri, { userContext: req.user || null })
  }
}
