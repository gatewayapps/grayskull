/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { decrypt } from '../../utils/cipher'

import { Session } from '../../../foundation/models/Session'
import { UserAccount } from '../../../foundation/models/UserAccount'
import ClientService from '../../api/services/ClientService'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import * as otplib from 'otplib'
import UserAccountService from './UserAccountService'
import UserClientService from './UserClientService'
import MailService from './MailService'
import SessionService from './SessionService'
import { IQueryOptions } from '../../../foundation/models/IQueryOptions'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'
import UserClientRepository from '../../data/repositories/UserClientRepository'
import ClientRepository from '../../data/repositories/ClientRepository'
import { Client } from '../../../foundation/models/Client'
import TokenService from './TokenService'
import { RefreshToken } from '../../../foundation/models/RefreshToken'
import { ScopeMap } from './ScopeService'

import EmailAddressRepository from '../../data/repositories/EmailAddressRepository'
import { GRAYSKULL_GLOBAL_SECRET } from '../../utils/environment'
import { getValueFromCache, deleteFromCache, cacheValue } from './CacheService'

import { IConfiguration } from '../../../foundation/types/types'

const CACHE_PREFIX = 'BACKUP_CODE_'

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
  public async authenticateUser(
    emailAddress: string,
    password: string,
    fingerprint: string,
    ipAddress: string,
    otpToken: string | null,
    extendedSession: boolean,
    options: IQueryOptions
  ): Promise<IAuthenticateUserResult> {
    // 1. Find the user account for the email address

    const user = await UserAccountService.getUserAccountByEmailAddressWithSensitiveData(emailAddress, options)

    if (!user) {
      throw new Error('Invalid email address/password combination')
    }

    if (!user.passwordHash || !user.isActive) {
      throw new Error('Your account is not active. Contact your system administrator.')
    }

    // 2. Verify the password matches
    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      throw new Error('Invalid email address/password combination')
    }

    // 2b. Verify the email address has been verified
    const email = await EmailAddressRepository.getEmailAddress({ emailAddress }, options)
    if (email && !email.verified) {
      return {
        success: false,
        otpRequired: false,
        emailVerificationRequired: true,
        message: 'You must verify your e-mail address before signing in.'
      }
    }

    // 3. Determine if the user requires a OTP to login
    if (user.otpEnabled && user.otpSecret) {
      const otpSecret = decrypt(user.otpSecret)
      const cacheKey = `${CACHE_PREFIX}${emailAddress}`
      // 3a. Verify the OTP token
      if (otpSecret === null || !this.verifyOtpToken(otpSecret, otpToken, options)) {
        const backupCode = await getValueFromCache(cacheKey, true)

        if (!backupCode || backupCode !== otpToken) {
          return {
            success: false,
            otpRequired: true,
            message: otpToken !== null && otpToken.length > 0 ? 'Invalid multi-factor authentication code' : ''
          }
        }
      }
      await deleteFromCache(cacheKey)
    }

    // 4. Create a session for the user
    const session = await SessionService.createSession(
      {
        fingerprint,
        userAccountId: user.userAccountId!,
        ipAddress
      },
      extendedSession,
      options
    )

    return {
      success: true,
      session
    }
  }

  public async generateOtpSecret(emailAddress: string, configuration: IConfiguration): Promise<string> {
    const secret = otplib.authenticator.generateSecret()
    const result = otplib.authenticator.keyuri(
      encodeURIComponent(emailAddress),
      encodeURIComponent(configuration.Server!.realmName!),
      secret
    )
    return result
  }

  public async getAccessToken(
    grant_type: GrantType,
    client_id: string,
    client_secret: string,
    code: string | null,
    refresh_token: string | null,
    configuration: IConfiguration,
    options: IQueryOptions
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

        const codeStringValue = await getValueFromCache(code, true)
        if (!codeStringValue) {
          throw new Error(`authorization_code has expired`)
        }

        const authCodeCacheResult = JSON.parse(codeStringValue)
        await deleteFromCache(code)

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

  public async sendBackupCode(
    emailAddress: string,
    configuration: IConfiguration,
    options: IQueryOptions
  ): Promise<boolean> {
    const user = await UserAccountService.getUserAccountByEmailAddressWithSensitiveData(emailAddress, options)
    if (!user || !user.otpEnabled || !user.otpSecret) {
      return false
    }

    const otpSecret = decrypt(user.otpSecret)
    if (!otpSecret) {
      return false
    }

    const backupCode = otplib.authenticator.generate(otpSecret)

    const cacheKey = `${CACHE_PREFIX}${emailAddress}`
    await cacheValue(cacheKey, backupCode, 30 * 60, true)

    await MailService.sendEmailTemplate(
      'backupCodeTemplate',
      emailAddress,
      `${configuration.Server!.realmName} Backup Code`,
      {
        realmName: configuration.Server!.realmName,
        user,
        backupCode
      },
      configuration
    )

    return true
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

  public verifyOtpToken(secret: string | null, token: string | null, options: IQueryOptions): boolean {
    if (!secret || !token) {
      return false
    }
    return otplib.authenticator.check(token, secret)
  }

  public async generateAuthorizationCode(
    userAccount: UserAccount,
    clientId: string,
    userClientId: string,
    scope: string[],
    nonce: string | undefined,
    options: IQueryOptions
  ): Promise<string> {
    const authorizationCode = crypto.randomBytes(64).toString('hex')
    await cacheValue(
      authorizationCode,
      JSON.stringify({ clientId, scope, userAccount, userClientId, nonce }),
      120,
      true
    )

    return authorizationCode
  }

  private verifyRefreshToken(client: Client, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, GRAYSKULL_GLOBAL_SECRET, (err, payload) => {
        if (err) {
          reject(err)
        } else {
          resolve(payload)
        }
      })
    })
  }
}

export default new AuthenticationService()
