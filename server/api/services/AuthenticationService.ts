import { Session } from '../../../foundation/models/Session'
import { UserAccount } from '../../../foundation/models/UserAccount'
import ClientService from '../../api/services/ClientService'

import * as otplib from 'otplib'
import UserClientService from './UserClientService'
import { IQueryOptions } from '../../../foundation/models/IQueryOptions'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'
import UserClientRepository from '../../data/repositories/UserClientRepository'
import ClientRepository from '../../data/repositories/ClientRepository'
import TokenService from './TokenService'
import { RefreshToken } from '../../../foundation/models/RefreshToken'

import { IConfiguration } from '../../../foundation/types/types'
import { ScopeMap } from '../../../foundation/constants/scopes'
import { DataContext } from '../../../foundation/context/getDataContext'
import { getValue } from '../../../operations/data/persistentCache/getValue'
import { clearValue } from '../../../operations/data/persistentCache/clearValue'

type GrantType = 'authorization_code' | 'refresh_token'

interface IAccessTokenResponse {
  token_type: 'Bearer'
  id_token?: string
  expires_in: number
  access_token?: string
  refresh_token?: string
  session_id?: string
}

interface IAuthenticateUserResult {
  success: boolean
  session?: Session
  message?: string
  otpRequired?: boolean
  emailVerificationRequired?: boolean
}

otplib.authenticator.options = {
  window: 4
}

class AuthenticationService {
  public async getAccessToken(
    grant_type: GrantType,
    client_id: string,
    client_secret: string,
    code: string | null,
    refresh_token: string | null,
    configuration: IConfiguration,
    options: IQueryOptions,
    dataContext: DataContext
  ): Promise<IAccessTokenResponse> {
    const client = await ClientService.validateClient(client_id, client_secret, options)
    if (!client) {
      throw new Error(`Invalid client_id or client_secret`)
    }
    let id_token: string | undefined
    let userAccount: UserAccount | null = null

    let finalRefreshToken: RefreshToken | null = null
    switch (grant_type) {
      case 'authorization_code': {
        if (!code) {
          throw new Error(`code is missing`)
        }

        const codeStringValue = await getValue(code, dataContext)
        if (!codeStringValue) {
          throw new Error(`authorization_code has expired`)
        }

        const authCodeCacheResult = JSON.parse(codeStringValue)
        await clearValue(code, dataContext)

        if (!authCodeCacheResult) {
          throw new Error(`authorization_code has expired`)
        }

        userAccount = await UserAccountRepository.getUserAccount(
          { userAccountId: authCodeCacheResult.userAccount.userAccountId || '' },
          options
        )
        if (!userAccount) {
          throw new Error(`Unable to locate user account`)
        }

        if (authCodeCacheResult.scope.includes(ScopeMap.openid.id)) {
          id_token = await TokenService.createIDToken(
            client,
            userAccount,
            authCodeCacheResult.nonce,
            undefined,
            configuration,
            options
          )
        }

        if (authCodeCacheResult.scope.includes(ScopeMap.offline_access.id)) {
          finalRefreshToken = await TokenService.createRefreshToken(client, userAccount, null, options)
        }

        break
      }

      case 'refresh_token': {
        if (!refresh_token) {
          throw new Error(`refresh_token is missing`)
        }

        finalRefreshToken = await TokenService.getRefreshTokenFromRawToken(refresh_token, client, options)

        if (!finalRefreshToken) {
          throw new Error(`Invalid refresh_token`)
        }

        const userClient = await UserClientRepository.getUserClient(
          { userClientId: finalRefreshToken.userClientId },
          options
        )
        if (!userClient || userClient.client_id !== client_id) {
          throw new Error(`Invalid refresh_token`)
        }

        userAccount = await UserAccountRepository.getUserAccount({ userAccountId: userClient.userAccountId }, options)

        if (userAccount && UserClientService.UserClientHasAllowedScope(userClient, ScopeMap.openid.id)) {
          id_token = await TokenService.createIDToken(client, userAccount, undefined, undefined, configuration, options)
        }
        break
      }

      default: {
        throw new Error(`grant_type '${grant_type}' is not supported`)
      }
    }

    if (!userAccount) {
      throw new Error(`Unable to locate user account`)
    }

    const userClient = await UserClientRepository.getUserClient(
      { userAccountId: userAccount.userAccountId!, client_id: client.client_id! },
      options
    )
    if (!userClient) {
      throw new Error(`Your user account does not have access to ${client.name}`)
    }

    const access_token = finalRefreshToken
      ? await TokenService.refreshAccessToken(finalRefreshToken.token, client.client_id, configuration, options)
      : await TokenService.createAccessToken(client, userAccount, finalRefreshToken, configuration, options)
    return {
      access_token,
      id_token,
      expires_in: configuration.Security!.accessTokenExpirationSeconds || 300,
      refresh_token: finalRefreshToken ? finalRefreshToken.token : undefined,
      token_type: 'Bearer'
    }
  }

  public async validateRedirectUri(client_id: string, redirectUri: string, options: IQueryOptions): Promise<boolean> {
    const client = await ClientRepository.getClient({ client_id }, options)
    if (client) {
      return (
        !client.redirectUris ||
        JSON.parse(client.redirectUris)
          .map((r) => r.toLowerCase().trim())
          .includes(redirectUri.toLowerCase().trim())
      )
    } else {
      return false
    }
  }

  public verifyOtpToken(secret: string | null, token: string | null): boolean {
    if (!secret || !token) {
      return false
    }
    return otplib.authenticator.check(token, secret)
  }
}

export default new AuthenticationService()
