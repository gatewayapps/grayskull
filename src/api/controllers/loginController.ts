import { query, queryMustEqual } from '@decorators/paramDecorator'
import { HttpMethod, route } from '@decorators/routeDecorator'
import AuthenticationService from '@services/AuthenticationService'
import ClientService from '@services/ClientService'
import { Request, Response } from 'express'
import ControllerBase from './ControllerBase'

export default class LoginController extends ControllerBase {
  @route(HttpMethod.POST, '/access_token')
  public async postAccessToken(req: Request, res: Response) {
    try {
      if (!req.body || !req.body.grant_type || !req.body.client_id || !req.body.client_secret) {
        res.status(400).json({ success: false, message: 'Invalid request body' })
        return
      }

      const accessTokenRespnse = await AuthenticationService.getAccessToken(req.body.grant_type, req.body.client_id, req.body.client_secret, req.body.code, req.body.refresh_token)
      res.json(accessTokenRespnse)
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  }

  @route(HttpMethod.GET, '/auth')
  @query('client_id', 'response_type', 'redirect_uri')
  @queryMustEqual('response_type', 'code')
  public async renderLoginPage(req: Request, res: Response) {
    if ((await this.validateLoginRequest(req)) === false) {
      res.status(400).send()
      return
    } else {
      res.locals.client = await ClientService.getClientByclient_id(parseInt(req.query.client_id, 10))
      return this.next.render(req, res, '/login', req.query)
    }
  }

  @route(HttpMethod.POST, '/auth')
  @query('client_id', 'response_type', 'redirect_uri')
  @queryMustEqual('response_type', 'code')
  public async processLoginRequest(req: Request, res: Response) {
    if ((await this.validateLoginRequest(req)) === false) {
      res.status(400).send()
      return
    } else {
      const authorizationCode = await AuthenticationService.authenticateUser(req.body.emailAddress, req.body.password)
      if (authorizationCode) {
        const queryParts = [`code=${authorizationCode}`]
        if (req.query.state) {
          queryParts.push(`state=${req.query.state}`)
        }
        const queryString = queryParts.join('&')
        return res.redirect(`${req.query.redirect_uri}?${queryString}`)
      } else {
        res.locals.error = { message: 'Invalid email address/password combination' }
        return this.renderLoginPage(req, res)
      }
    }
  }

  private async validateLoginRequest(req: Request): Promise<boolean> {
    const validated = await AuthenticationService.validateRedirectUri(parseInt(req.query.client_id, 10), req.query.redirect_uri)
    return validated
  }
}
