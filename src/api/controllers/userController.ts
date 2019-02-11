import ControllerBase from './ControllerBase'
import { route, HttpMethod } from '@decorators/routeDecorator'
import { Request, Response } from 'express'
import { useScope } from '@decorators/useAccessTokenDecorator'
import { IClientRequestOptions } from '@data/IClientRequestOptions'
import TokenService from '@services/TokenService'
import EmailAddressService from '@services/EmailAddressService'
import { ScopeMap } from '@services/ScopeService'
import { IUserAccount } from '@data/models/IUserAccount'
import UserAccountService from '@services/UserAccountService'
import UserAccountRepository from '@data/repositories/UserAccountRepository'
export default class UserController extends ControllerBase {
  @route(HttpMethod.GET, '/userinfo')
  @useScope(ScopeMap.openid.id)
  public async getUserInfo(req: Request, res: Response, clientOptions: IClientRequestOptions) {
    const profile = await TokenService.getUserProfileForClient(clientOptions.client, clientOptions.userAccount, { userContext: clientOptions.userAccount })
    res.json(profile)
  }

  @route(HttpMethod.POST, '/userinfo')
  @useScope(ScopeMap['profile:write'].id)
  public async updateUserInfo(req: Request, res: Response, clientOptions: IClientRequestOptions) {
    try {
      const reqBody: IUserAccount = req.body as IUserAccount
      if (reqBody) {
        const { firstName, lastName, displayName, gender, birthday } = reqBody
        const result = await UserAccountRepository.updateUserAccount(
          {
            userAccountId: clientOptions.userAccount.userAccountId
          },
          {
            firstName,
            lastName,
            displayName,
            gender,
            birthday
          },
          { userContext: clientOptions.userAccount }
        )

        if (result) {
          const response = await TokenService.getUserProfileForClient(clientOptions.client, clientOptions.userAccount, { userContext: clientOptions.userAccount })
          res.json({ success: true, profile: response })
          return
        } else {
          res.json({ success: false, message: 'Something went wrong' })
        }
      }
    } catch (err) {
      res.json({ success: false, message: err.message })
    }
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
