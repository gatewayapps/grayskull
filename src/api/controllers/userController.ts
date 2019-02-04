import ControllerBase from './ControllerBase'
import { route, HttpMethod } from '@decorators/routeDecorator'
import { Request, Response } from 'express'
import { useAccessToken } from '@decorators/useAccessTokenDecorator'
import { IClientRequestOptions } from '@data/IClientRequestOptions'
import TokenService from '@services/TokenService'
import EmailAddressService from '@services/EmailAddressService'
export default class UserController extends ControllerBase {
  @route(HttpMethod.GET, '/userinfo')
  @useAccessToken()
  public async getUserInfo(req: Request, res: Response, clientOptions: IClientRequestOptions) {
    const profile = await TokenService.getUserProfileForClient(clientOptions.client, clientOptions.userAccount, { userContext: clientOptions.userAccount })
    res.json(profile)
  }

  @route(HttpMethod.GET, '/verify')
  public async verifyEmailAddress(req: Request, res: Response) {
    try {
      const result = await EmailAddressService.verifyEmailAddress(req.query.address, req.query.code, { userContext: null })
      if (req.user) {
        res.redirect('/profile/emailAddresses?emailVerified=1')
      } else {
        res.redirect('/login?emailVerified=1')
      }
    } catch (err) {
      res.locals.error = { message: err.message }
      return this.next.render(req, res, '/error', req.query)
    }
  }
}
