import { UserAccount } from './models/IUserAccount'
import { Client } from './models/IClient'
import { IAccessToken } from '../api/services/TokenService'

export interface IClientRequestOptions {
  userAccount: UserAccount
  client: Client
  accessToken: IAccessToken
}
