import { IUserAccount } from './models/IUserAccount'
import { IClient } from './models/IClient'
import { IAccessToken } from '@services/TokenService'

export interface IClientRequestOptions {
  userAccount: IUserAccount
  client: IClient
  accessToken: IAccessToken
}
