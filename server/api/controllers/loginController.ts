import { query } from '../../decorators/paramDecorator'
import { HttpMethod, route } from '../../decorators/routeDecorator'
import AuthenticationService from '../../api/services/AuthenticationService'
import UserAccountService from '../../api/services/UserAccountService'
import { Request, Response } from 'express'
import ControllerBase from './ControllerBase'

export default class LoginController extends ControllerBase {
  // @route(HttpMethod.GET, '/jwks')
  // public async getJWKS(req: Request, res: Response) {
  //   const jwks = CertificateService.getJWKS()
  //   res.json({ keys: [jwks] })
  // }

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
