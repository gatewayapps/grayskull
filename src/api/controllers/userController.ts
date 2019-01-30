import ControllerBase from './ControllerBase'
import { route, HttpMethod } from '@decorators/routeDecorator'
import { Request, Response } from 'express'
import { useAccessToken } from '@decorators/useAccessTokenDecorator'
import { IClientRequestOptions } from '@data/IClientRequestOptions'
import TokenService from '@services/TokenService'
export default class UserController extends ControllerBase {
  @route(HttpMethod.GET, '/userinfo')
  @useAccessToken()
  public async getUserInfo(req: Request, res: Response, clientOptions: IClientRequestOptions) {
    const profile = await TokenService.getUserProfileForClient(clientOptions.client, clientOptions.userAccount, { userContext: clientOptions.userAccount })
    res.json(profile)
  }
}
