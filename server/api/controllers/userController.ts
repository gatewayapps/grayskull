import ControllerBase from './ControllerBase'
import { HttpMethod, route } from '../../decorators/routeDecorator'
import { Request, Response } from 'express'
import { useScope } from '../../decorators/useAccessTokenDecorator'
import { IClientRequestOptions } from '../../data/IClientRequestOptions'
import TokenService from '../../api/services/TokenService'
import EmailAddressService from '../../api/services/EmailAddressService'
import { ScopeMap } from '../../api/services/ScopeService'
import { IUserAccount } from '../../data/models/IUserAccount'
import UserAccountService from '../../api/services/UserAccountService'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'
import UserClientService from '../../api/services/UserClientService'
import { Permissions } from '../../utils/permissions'
export default class UserController extends ControllerBase {
  @route(HttpMethod.GET, '/userinfo')
  @useScope(ScopeMap.openid.id)
  public async getUserInfo(req: Request, res: Response, clientOptions: IClientRequestOptions) {
    const profile = await TokenService.getUserProfileForClient(clientOptions.client, clientOptions.userAccount, { userContext: clientOptions.userAccount })
    res.json(profile)
  }

  @route(HttpMethod.POST, '/users/:userAccountId/userinfo')
  @useScope(ScopeMap['admin-profile:write'].id)
  public async updateOtherUserInfo(req: Request, res: Response, clientOptions: IClientRequestOptions) {
    // Is the calling user an admin
    if (clientOptions.userAccount.permissions! >= Permissions.Admin) {
      try {
        // Get the calling user's user client to check permissions
        const callingUserClient = await UserClientService.getUserClient(
          { client_id: clientOptions.client.client_id, userAccountId: clientOptions.userAccount.userAccountId },
          { userContext: clientOptions.userAccount }
        )

        // Has the calling user granted admin-profile:write to the calling client
        if (callingUserClient && UserClientService.UserClientHasAllowedScope(callingUserClient, ScopeMap['admin-profile:write'].id)) {
          const reqBody: IUserAccount = req.body as IUserAccount

          if (reqBody) {
            const { firstName, lastName, displayName, gender, birthday } = reqBody

            // We need to get the UserClient for the target user
            const targetUserClient = await UserClientService.getUserClient(
              { client_id: clientOptions.client.client_id, userClientId: req.params['userAccountId'] },
              { userContext: clientOptions.userAccount }
            )

            // Has the target user authorized the target client
            if (targetUserClient) {
              const result = await UserAccountRepository.updateUserAccount(
                {
                  userAccountId: targetUserClient.userAccountId
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
            } else {
              res.json({ success: false, message: 'Unable to find a user with that id' })
            }
          }
        } else {
          res.json({ success: false, message: 'Not authorized' })
        }
      } catch (err) {
        res.json({ success: false, message: err.message })
      }
    } else {
      res.json({ succes: false, message: 'You must be an administrator to do that' })
    }
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
}
