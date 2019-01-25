import ConfigurationManager from '@/config/ConfigurationManager'
import { decrypt } from '@/utils/cipher'
import { ClientInstance } from '@data/models/Client'
import { ISession } from '@data/models/ISession'
import { IUserAccount } from '@data/models/IUserAccount'
import ClientService from '@services/ClientService'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import NodeCache from 'node-cache'
import * as otplib from 'otplib'
import UserAccountService from './UserAccountService'
import UserClientService from './UserClientService'
import MailService from './MailService'
import SessionService from './SessionService'
import { IQueryOptions } from '../../data/IQueryOptions'
import UserAccountRepository from '@data/repositories/UserAccountRepository'
import UserClientRepository from '@data/repositories/UserClientRepository'
import ClientRepository from '@data/repositories/ClientRepository'

const LOWERCASE_REGEX = /[a-z]/
const UPPERCASE_REGEX = /[A-Z]/
const NUMBER_REGEX = /\d/
const SYMBOL_REGEX = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/

type GrantType = 'authorization_code' | 'refresh_token'

interface IAccessTokenResponse {
  token_type: 'Bearer'
  expires_in: number
  access_token: string
  refresh_token: string
  session_id?: string
}

interface IAuthenticationCodeCacheResult {
  clientId: string
  scope: string[]
  userAccount: IUserAccount
  userClientId: string
}

interface IAuthenticateUserResult {
  success: boolean
  session?: ISession
  message?: string
  otpRequired?: boolean
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
  private localCache: NodeCache
  constructor() {
    this.localCache = new NodeCache()
  }

  public async authenticateUser(
    emailAddress: string,
    password: string,
    fingerprint: string,
    ipAddress: string,
    otpToken: string | null,
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

    // 3. Determine if the user requires a OTP to login
    if (user.otpEnabled && user.otpSecret) {
      const otpSecret = decrypt(user.otpSecret)

      // 3a. Verify the OTP token
      if (otpSecret === null || !this.verifyOtpToken(otpSecret, otpToken, options)) {
        const backupCode = this.localCache.get<string>(emailAddress)

        if (!backupCode || backupCode !== otpToken) {
          return {
            success: false,
            otpRequired: true,
            message: otpToken !== null && otpToken.length > 0 ? 'Invalid multi-factor authentication code' : ''
          }
        }
      }

      this.localCache.del(emailAddress)
    }

    // 4. Create a session for the user
    const session = await SessionService.createSession(
      {
        fingerprint,
        userAccountId: user.userAccountId!,
        ipAddress
      },
      options
    )

    return {
      success: true,
      session
    }
  }

  public generateOtpSecret(emailAddress: string): string {
    const secret = otplib.authenticator.generateSecret()
    return otplib.authenticator.keyuri(emailAddress, ConfigurationManager.Server!.realmName, secret)
  }

  public async getAccessToken(
    grant_type: GrantType,
    client_id: string,
    client_secret: string,
    code: string | null,
    refresh_token: string | null,
    options: IQueryOptions
  ): Promise<IAccessTokenResponse> {
    const client = await ClientService.validateClient(client_id, client_secret, options)
    if (!client) {
      throw new Error(`Invalid client_id or client_secret`)
    }

    let userAccount: IUserAccount | null = null
    let session_id: string | undefined

    switch (grant_type) {
      case 'authorization_code': {
        if (!code) {
          throw new Error(`code is missing`)
        }

        const authCodeCacheResult = this.localCache.get<IAuthenticationCodeCacheResult>(code)
        if (!authCodeCacheResult) {
          throw new Error(`authorization_code has expired`)
        }

        userAccount = await UserAccountRepository.getUserAccount({ userAccountId: authCodeCacheResult.userAccount.userAccountId || '' }, options)
        if (!userAccount) {
          throw new Error(`Unable to locate user account`)
        }

        refresh_token = await this.createRefreshToken(client, userAccount, '', options)
        break
      }

      case 'refresh_token': {
        if (!refresh_token) {
          throw new Error(`refresh_token is missing`)
        }

        const decodedRefreshToken = await this.verifyRefreshToken(client, refresh_token)
        if (!decodedRefreshToken || decodedRefreshToken.client_id !== client.client_id) {
          throw new Error(`Invalid refresh_token`)
        }

        userAccount = await UserAccountRepository.getUserAccount({ userAccountId: decodedRefreshToken.userAccountId }, options)
        break
      }

      default: {
        throw new Error(`grant_type '${grant_type}' is not supported`)
      }
    }

    if (!userAccount) {
      throw new Error(`Unable to locate user account`)
    }

    const userClient = await UserClientRepository.getUserClient({ userAccountId: userAccount.userAccountId!, client_id: client.client_id! }, options)
    if (!userClient) {
      throw new Error(`Your user account does not have access to ${client.name}`)
    }

    const access_token = await this.createAccessToken(client, { userContext: userAccount })

    return {
      access_token,
      expires_in: ConfigurationManager.Security!.accessTokenExpirationSeconds,
      refresh_token,
      session_id,
      token_type: 'Bearer'
    }
  }

  public async sendBackupCode(emailAddress: string, options: IQueryOptions): Promise<boolean> {
    const user = await UserAccountService.getUserAccountByEmailAddressWithSensitiveData(emailAddress, options)
    if (!user || !user.otpEnabled || !user.otpSecret) {
      return false
    }

    const otpSecret = decrypt(user.otpSecret)
    if (!otpSecret) {
      return false
    }

    const backupCode = otplib.authenticator.generate(otpSecret)
    this.localCache.set(emailAddress, backupCode, 16 * 60)
    const body = `Your login code is: ${backupCode}<br/><br/>This code will expire in 15 minutes.`
    MailService.sendMail(emailAddress, 'Login Code', body)
    return true
  }

  public async shouldUserChangePassword(emailAddress: string, options: IQueryOptions): Promise<boolean> {
    if (ConfigurationManager.Security!.maxPasswordAge > 0) {
      const userAccount = await UserAccountService.getUserAccountByEmailAddress(emailAddress, options)
      if (userAccount) {
        const lastPasswordChange = userAccount.lastPasswordChange || userAccount.createdAt!
        const daysSincePasswordChange = Math.abs(moment().diff(lastPasswordChange, 'days'))
        if (daysSincePasswordChange >= ConfigurationManager.Security!.maxPasswordAge) {
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
    const requiredParts: string[] = []
    if (ConfigurationManager.Security!.passwordRequiresLowercase) {
      requiredParts.push('lowercase letter (a-z)')
    }
    if (ConfigurationManager.Security!.passwordRequiresUppercase) {
      requiredParts.push('uppercase letter (A-Z)')
    }
    if (ConfigurationManager.Security!.passwordRequiresNumber) {
      requiredParts.push('number (0-9)')
    }
    if (ConfigurationManager.Security!.passwordRequiresSymbol) {
      requiredParts.push('symbol (!, #, @, etc...)')
    }

    const PasswordValidationError = `Password must contain at least one each of the following: ${requiredParts.join(', ')}`

    if (password !== confirm) {
      throw new Error('Passwords do not match.  Please re-enter your passwords')
    }

    if (ConfigurationManager.Security!.passwordRequiresLowercase && LOWERCASE_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (ConfigurationManager.Security!.passwordRequiresUppercase && UPPERCASE_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (ConfigurationManager.Security!.passwordRequiresNumber && NUMBER_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (ConfigurationManager.Security!.passwordRequiresSymbol && SYMBOL_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (password.length < ConfigurationManager.Security!.passwordMinimumLength) {
      throw new Error(`Password must be at least ${ConfigurationManager.Security!.passwordMinimumLength} characters long`)
    }
    return true
  }

  public verifyOtpToken(secret: string | null, token: string | null, options: IQueryOptions): boolean {
    if (!secret || !token) {
      return false
    }
    return otplib.authenticator.check(token, secret)
  }

  private createAccessToken(client: ClientInstance, options: IQueryOptions): Promise<string> {
    const userAccount = options.userContext
    return new Promise((resolve, reject) => {
      const payload = Object.assign({}, userAccount, {
        client_id: client.client_id
      })
      const options = {
        expiresIn: ConfigurationManager.Security!.accessTokenExpirationSeconds
      }
      return jwt.sign(payload, client.secret || '', options, (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      })
    })
  }

  private createRefreshToken(client: ClientInstance, userAccount: IUserAccount, sessionId: string, options: IQueryOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!client.client_id) {
        reject(new Error('client_id is missing'))
        return
      }

      if (!userAccount.userAccountId) {
        reject(new Error('userAccountId is missing'))
        return
      }

      const payload: IRefreshTokenPayload = {
        client_id: client.client_id,
        session_id: sessionId,
        userAccountId: userAccount.userAccountId
      }
      return jwt.sign(payload, ConfigurationManager.Security!.globalSecret, (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      })
    })
  }

  public generateAuthorizationCode(userAccount: IUserAccount, clientId: string, userClientId: string, scope: string[], options: IQueryOptions): string {
    const authorizationCode = crypto.randomBytes(64).toString('hex')
    this.localCache.set(authorizationCode, { clientId, scope, userAccount, userClientId }, 120)
    return authorizationCode
  }

  private verifyRefreshToken(client: ClientInstance, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, ConfigurationManager.Security!.globalSecret, (err, payload) => {
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
