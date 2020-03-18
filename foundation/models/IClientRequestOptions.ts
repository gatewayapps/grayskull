import { IAccessToken } from '../types/tokens'
import { UserContext } from '../context/getUserContext'
import { IUserClient, IClient } from '../types/types'

export interface IClientRequestOptions {
	userAccount?: UserContext
	userClient?: IUserClient
	client?: IClient
	accessToken: IAccessToken
}
