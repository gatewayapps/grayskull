import UserClientRepository from '../../data/repositories/UserClientRepository'

import jwt from 'jsonwebtoken'
import ClientRepository from '../../data/repositories/ClientRepository'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'

import { IClientRequestOptions } from '../../../foundation/models/IClientRequestOptions'

import { IAccessToken } from '../../../foundation/types/tokens'

import { IRequestContext } from '../../../foundation/context/prepareContext'
import { createUserContextForUserId } from '../../../foundation/context/getUserContext'

class TokenService {
  public async validateAndDecodeAccessToken(
    accessToken: string,
    context: IRequestContext
  ): Promise<IClientRequestOptions> {
    const decoded: IAccessToken | null = jwt.decode(accessToken) as IAccessToken
    if (decoded !== null) {
      const userClient = await UserClientRepository.getUserClient({ userClientId: decoded.sub }, {})
      const client = await ClientRepository.getClientWithSensitiveData({ client_id: userClient!.client_id }, {})
      if (client && jwt.verify(accessToken, client.secret)) {
        const userAccount = await UserAccountRepository.getUserAccount(
          {
            userAccountId: userClient!.userAccountId
          },
          {}
        )

        if (userAccount) {
          const userAccountProfile = await createUserContextForUserId(
            userAccount.userAccountId,
            context.dataContext,
            context.cacheContext,
            context.configuration
          )

          return {
            client: userClient!,
            userAccount: userAccountProfile!,
            accessToken: decoded
          }
        }
      }
    }
    throw new Error('Invalid access token')
  }
}

export default new TokenService()
