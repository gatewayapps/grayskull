import { getCurrentConfiguration } from '../../config/ConfigurationManager'
import { decrypt } from '../../utils/cipher'

import { Session } from '../../data/models/ISession'
import { UserAccount } from '../../data/models/IUserAccount'
import ClientService from '../../api/services/ClientService'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import moment from 'moment'

import * as otplib from 'otplib'
import UserAccountService from './UserAccountService'
import UserClientService from './UserClientService'
import MailService from './MailService'
import SessionService from './SessionService'
import { IQueryOptions } from '../../data/IQueryOptions'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'
import UserClientRepository from '../../data/repositories/UserClientRepository'
import ClientRepository from '../../data/repositories/ClientRepository'
import { Client } from '../../data/models/IClient'
import TokenService from './TokenService'
import { RefreshToken } from '../../data/models/IRefreshToken'
import { ScopeMap } from './ScopeService'

import EmailAddressRepository from '../../data/repositories/EmailAddressRepository'
import { GRAYSKULL_GLOBAL_SECRET } from '../../utils/environment'
import { getValueFromCache, deleteFromCache, cacheValue } from './CacheService'

const CACHE_PREFIX = 'BACKUP_CODE_'

const LOWERCASE_REGEX = /[a-z]/
const UPPERCASE_REGEX = /[A-Z]/
const NUMBER_REGEX = /\d/
const SYMBOL_REGEX = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/

type GrantType = 'authorization_code' | 'refresh_token'

interface IAccessTokenResponse {
  token_type: 'Bearer'
  id_token?: string
  expires_in: number
  access_token?: string
  refresh_token?: string
  session_id?: string
}

interface IAuthenticationCodeCacheResult {
  clientId: string
  scope: string[]
  userAccount: UserAccount
  userClientId: string
  nonce: string | undefined
}

interface IAuthenticateUserResult {
  success: boolean
  session?: Session
  message?: string
  otpRequired?: boolean
  emailVerificationRequired?: boolean
}

interface IRefreshTokenPayload {
  client_id: string
  session_id: string
  userAccountId: string
}

otplib.authenticator.options = {
  window: 4
}

class AuthenticationService {


  public async verifyPassword(userAccountId: string, password: string, options: IQueryOptions) {
    const user = await UserAccountRepository.getUserAccountWithSensitiveData({ userAccountId }, options)
    if (user) {
      return await bcrypt.compare(password, user.passwordHash)
    } else {
      return false
    }
  }

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

  public async generateOtpSecret(emailAddress: string): Promise<string> {
    const config = await getCurrentConfiguration()

    const secret = otplib.authenticator.generateSecret()
    const result = otplib.authenticator.keyuri(
      encodeURIComponent(emailAddress),
      encodeURIComponent(config.Server!.realmName!),
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
    options: IQueryOptions
  ): Promise<IAccessTokenResponse> {
    const config = await getCurrentConfiguration()
    const client = await ClientService.validateClient(client_id, client_secret, options)
    if (!client) {
      throw new Error(`Invalid client_id or client_secret`)
    }
    let id_token: string | undefined
    let userAccount: UserAccount | null = null
    let session_id: string | undefined
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
          id_token = await TokenService.createIDToken(client, userAccount, undefined, undefined, options)
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
      ? await TokenService.refreshAccessToken(finalRefreshToken.token, client.client_id, options)
      : await TokenService.createAccessToken(client, userAccount, finalRefreshToken, options)
    return {
      access_token,
      id_token,
      expires_in: config.Security!.accessTokenExpirationSeconds || 300,
      refresh_token: finalRefreshToken ? finalRefreshToken.token : undefined,
      token_type: 'Bearer'
    }
  }

  public async sendBackupCode(emailAddress: string, options: IQueryOptions): Promise<boolean> {
    const config = await getCurrentConfiguration()

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
    await cacheValue(cacheKey, backupCode, 16 * 16, true)


    await MailService.sendEmailTemplate('backupCodeTemplate', emailAddress, `${config.Server!.realmName} Backup Code`, {
      realmName: config.Server!.realmName,
      user,
      backupCode
    })

    return true
  }

  public async shouldUserChangePassword(emailAddress: string, options: IQueryOptions): Promise<boolean> {
    const config = await getCurrentConfiguration()
    if (config.Security!.maxPasswordAge && config.Security!.maxPasswordAge > 0) {
      const userAccount = await UserAccountService.getUserAccountByEmailAddress(emailAddress, options)
      if (userAccount) {
        const lastPasswordChange = userAccount.lastPasswordChange || userAccount.createdAt!
        const daysSincePasswordChange = Math.abs(moment().diff(lastPasswordChange, 'days'))
        if (daysSincePasswordChange >= config.Security!.maxPasswordAge) {
          return true
        }
      }
    }
    return false
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

  public async validatePassword(password: string, confirm: string, options: IQueryOptions): Promise<boolean> {
    const config = await getCurrentConfiguration()

    const requiredParts: string[] = []
    if (config.Security!.passwordRequiresLowercase) {
      requiredParts.push('lowercase letter (a-z)')
    }
    if (config.Security!.passwordRequiresUppercase) {
      requiredParts.push('uppercase letter (A-Z)')
    }
    if (config.Security!.passwordRequiresNumber) {
      requiredParts.push('number (0-9)')
    }
    if (config.Security!.passwordRequiresSymbol) {
      requiredParts.push('symbol (!, #, @, etc...)')
    }

    const PasswordValidationError = `Password must contain at least one each of the following: ${requiredParts.join(
      ', '
    )}`

    if (password !== confirm) {
      throw new Error('Passwords do not match.  Please re-enter your passwords')
    }

    if (config.Security!.passwordRequiresLowercase && LOWERCASE_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (config.Security!.passwordRequiresUppercase && UPPERCASE_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (config.Security!.passwordRequiresNumber && NUMBER_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (config.Security!.passwordRequiresSymbol && SYMBOL_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (password.length < (config.Security!.passwordMinimumLength || 8)) {
      throw new Error(`Password must be at least ${config.Security!.passwordMinimumLength} characters long`)
    }
    return true
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
    await cacheValue(authorizationCode, JSON.stringify({ clientId, scope, userAccount, userClientId, nonce }), 120)

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
