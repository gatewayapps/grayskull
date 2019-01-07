import ConfigurationManager from '@/config/ConfigurationManager'
import { decrypt } from '@/utils/cipher'
import { ClientInstance } from '@data/models/Client'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import ClientService from '@services/ClientService'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import NodeCache from 'node-cache'
import * as otplib from 'otplib'
import UserAccountService from './UserAccountService'
import UserClientService from './UserClientService'

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
  sessionId: string
  userAccount: IUserAccount
}

interface IAuthenticateUserResult {
  success: boolean
  code?: string
  message?: string
  otpRequired?: boolean
}

interface IRefreshTokenPayload {
  client_id: number
  session_id: string
  userAccountId: number
}

otplib.authenticator.options = {
  window: 4,
}

class AuthenticationService {
  private localCache: NodeCache
  constructor() {
    this.localCache = new NodeCache()
  }

  public async authenticateUser(emailAddress: string, password: string, sessionId: string, clientId: number, otpToken?: string): Promise<IAuthenticateUserResult> {
    const existingUser = await UserAccountService.getUserAccountWithSensitiveData({ emailAddress })

    if (!existingUser) {
      throw new Error('Invalid email address/password combination')
    }

    if (!existingUser.passwordHash || !existingUser.isActive) {
      throw new Error('Your account is not active. Contact your system administrator.')
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.passwordHash)
    if (!passwordMatch) {
      throw new Error('Invalid email address/password combination')
    }

    if (existingUser.otpEnabled && existingUser.otpSecret) {
      const otpSecret = decrypt(existingUser.otpSecret)

      if (otpSecret === null || !this.verifyOtpToken(otpSecret, otpToken)) {
        return {
          success: false,
          otpRequired: true,
          message: otpToken !== undefined && otpToken.length > 0 ? 'Invalid multi-factor authentication code' : ''
        }
      }
    }

    const userClient = await UserClientService.getUserClient({ userAccountId: existingUser.userAccountId!, client_id: clientId })
    if (!userClient) {
      throw new Error('You do not have access to login here. Contact your system administrator.')
    }

    const authCode = this.generateAndCacheAuthorizationCode(existingUser, sessionId)
    return {
      success: true,
      code: authCode,
    }
  }

  public generateOtpSecret(emailAddress: string): string {
    const secret = otplib.authenticator.generateSecret()
    return otplib.authenticator.keyuri(emailAddress, ConfigurationManager.General.realmName, secret)
  }

  public async getAccessToken(grant_type: GrantType, client_id: number, client_secret: string, code?: string, refresh_token?: string): Promise<IAccessTokenResponse> {
    const client = await ClientService.validateClient(client_id, client_secret)
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

        const authCodeCacheResult = await this.getAuthorizationCodeFromCache(code)
        if (!authCodeCacheResult) {
          throw new Error(`authorization_code has expired`)
        }

        userAccount = await UserAccountService.getUserAccount({ userAccountId: authCodeCacheResult.userAccount.userAccountId || -1 })
        if (!userAccount) {
          throw new Error(`Unable to locate user account`)
        }

        refresh_token = await this.createRefreshToken(client, userAccount, authCodeCacheResult.sessionId)
        session_id = authCodeCacheResult.sessionId
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

        userAccount = await UserAccountService.getUserAccount({ userAccountId: decodedRefreshToken.userAccountId })
        break
      }

      default: {
        throw new Error(`grant_type '${grant_type}' is not supported`)
      }
    }

    if (!userAccount) {
      throw new Error(`Unable to locate user account`)
    }

    const userClient = await UserClientService.getUserClient({ userAccountId: userAccount.userAccountId!, client_id: client.client_id! })
    if (!userClient) {
      throw new Error(`Your user account does not have access to ${client.name}`)
    }

    const access_token = await this.createAccessToken(client, userAccount)

    return {
      access_token,
      expires_in: ConfigurationManager.Security.accessTokenExpiresIn,
      refresh_token,
      session_id,
      token_type: 'Bearer'
    }
  }

  public async shouldUserChangePassword(emailAddress: string): Promise<boolean> {
    if (ConfigurationManager.Security.passwordExpiresDays > 0) {
      const userAccount = await UserAccountService.getUserAccount({ emailAddress })
      if (userAccount) {
        const lastPasswordChange = userAccount.lastPasswordChange || userAccount.createdAt!
        const daysSincePasswordChange = Math.abs(moment().diff(lastPasswordChange, 'days'))
        if (daysSincePasswordChange >= ConfigurationManager.Security.passwordExpiresDays) {
          return true
        }
      }
    }
    return false
  }

  public async validateRedirectUri(client_id: number, redirectUri: string): Promise<boolean> {
    const client = await ClientService.getClient({ client_id })
    if (client) {
      return (
        !client.url ||
        redirectUri
          .toLowerCase()
          .trim()
          .startsWith(client.url.toLowerCase().trim())
      )
    } else {
      return false
    }
  }

  public async validatePassword(password: string, confirm: string): Promise<boolean> {
    const requiredParts: string[] = []
    if (ConfigurationManager.Security.passwordRequireLowercase) {
      requiredParts.push('lowercase letter (a-z)')
    }
    if (ConfigurationManager.Security.passwordRequireUppercase) {
      requiredParts.push('uppercase letter (A-Z)')
    }
    if (ConfigurationManager.Security.passwordRequireNumber) {
      requiredParts.push('number (0-9)')
    }
    if (ConfigurationManager.Security.passwordRequireSymbol) {
      requiredParts.push('symbol (!, #, @, etc...)')
    }

    const PasswordValidationError = `Password must contain at least one each of the following: ${requiredParts.join(', ')}`

    if (password !== confirm) {
      throw new Error('Passwords do not match.  Please re-enter your passwords')
    }

    if (ConfigurationManager.Security.passwordRequireLowercase && LOWERCASE_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (ConfigurationManager.Security.passwordRequireUppercase && UPPERCASE_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (ConfigurationManager.Security.passwordRequireNumber && NUMBER_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (ConfigurationManager.Security.passwordRequireSymbol && SYMBOL_REGEX.test(password) === false) {
      throw new Error(PasswordValidationError)
    }
    if (password.length < ConfigurationManager.Security.passwordMinimumLength) {
      throw new Error(`Password must be at least ${ConfigurationManager.Security.passwordMinimumLength} characters long`)
    }
    return true
  }

  public verifyOtpToken(secret: string | undefined, token: string | undefined): boolean {
    if (!secret || !token) {
      return false
    }
    return otplib.authenticator.check(token, secret)
  }

  private createAccessToken(client: ClientInstance, userAccount: IUserAccount): Promise<string> {
    return new Promise((resolve, reject) => {
      const payload = Object.assign({}, userAccount, {
        client_id: client.client_id
      })
      const options = {
        expiresIn: ConfigurationManager.Security.accessTokenExpiresIn
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

  private createRefreshToken(client: ClientInstance, userAccount: IUserAccount, sessionId: string): Promise<string> {
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
      return jwt.sign(payload, ConfigurationManager.Security.globalSecret, (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      })
    })
  }

  private generateAndCacheAuthorizationCode(userAccount: IUserAccount, sessionId: string): string {
    const authorizationCode = crypto.randomBytes(64).toString('hex')
    this.localCache.set(authorizationCode, { sessionId, userAccount }, 120)
    return authorizationCode
  }

  private getAuthorizationCodeFromCache(code: string): Promise<IAuthenticationCodeCacheResult | undefined> {
    return new Promise((resolve, reject) => {
      this.localCache.get<IAuthenticationCodeCacheResult>(code, (err, cacheResult) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(cacheResult)
        }
      })
    })
  }

  private verifyRefreshToken(client: ClientInstance, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, ConfigurationManager.Security.globalSecret, (err, payload) => {
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
