import ConfigurationManager from '@/config/ConfigurationManager'
import { ClientInstance } from '@data/models/Client'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import ClientService from '@services/ClientService'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import NodeCache from 'node-cache'
import UserAccountService from './UserAccountService'

const LOWERCASE_REGEX = /[a-z]/
const UPPERCASE_REGEX = /[A-Z]/
const NUMBER_REGEX = /\d/
const SYMBOL_REGEX = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/

type GrantType = 'authorization_code' | 'refresh_token'

interface IAccessTokenResponse {
  token_type: 'Bearer'
  expires_in: number
  access_token: string
  refresh_token: string
}

class AuthenticationService {
  private localCache: NodeCache
  constructor() {
    this.localCache = new NodeCache()
  }

  public async authenticateUser(emailAddress: string, password: string): Promise<string | boolean> {
    const existingUser = await UserAccountService.getUserAccountByemailAddressWithSensitiveData(emailAddress)
    if (existingUser) {
      const passwordMatch = await bcrypt.compare(password, existingUser.passwordHash)
      if (passwordMatch) {
        return this.generateAndCacheAuthorizationCode(existingUser)
      }
    }
    return false
  }

  public async getAccessToken(grant_type: GrantType, client_id: number, client_secret: string, code: string | undefined, refresh_token: string | undefined): Promise<IAccessTokenResponse> {
    const client = await ClientService.validateClient(client_id, client_secret)
    if (!client) {
      throw new Error(`Invalid client_id or client_secret`)
    }

    switch (grant_type) {
      case 'authorization_code': {
        if (!code) {
          throw new Error(`code is missing`)
        }

        const authCodeUserAccount = await this.getAuthorizationCodeFromCache(code)
        if (!authCodeUserAccount) {
          throw new Error(`authorization_code has expired`)
        }

        const userAccount = await UserAccountService.getUserAccountByuserAccountId(authCodeUserAccount.userAccountId || -1)
        if (!userAccount) {
          throw new Error(`Unable to locate user account`)
        }

        return await this.composeAccessTokenResponse(client, userAccount)
      }

      case 'refresh_token': {
        if (!refresh_token) {
          throw new Error(`refresh_token is missing`)
        }

        const decodedRefreshToken = await this.verifyToken(client, refresh_token)
        if (!decodedRefreshToken || decodedRefreshToken.client_id !== client.client_id) {
          throw new Error(`Invalid refresh_token`)
        }

        const userAccount = await UserAccountService.getUserAccountByuserAccountId(decodedRefreshToken.userAccountId)
        if (!userAccount) {
          throw new Error(`Unable to locate user account`)
        }

        return await this.composeAccessTokenResponse(client, userAccount)
      }
    }

    throw new Error(`grant_type '${grant_type}' is not supported`)
  }

  public async shouldUserChangePassword(emailAddress: string): Promise<boolean> {
    if (ConfigurationManager.Security.passwordExpiresDays > 0) {
      const userAccount = await UserAccountService.getUserAccountByemailAddress(emailAddress)
      if (userAccount) {
        const lastPasswordChange = userAccount.lastPasswordChange || userAccount.dateCreated!
        const daysSincePasswordChange = Math.abs(moment().diff(lastPasswordChange, 'days'))
        if (daysSincePasswordChange >= ConfigurationManager.Security.passwordExpiresDays) {
          return true
        }
      }
    }
    return false
  }

  public async validateRedirectUri(client_id: number, redirectUri: string): Promise<boolean> {
    const client = await ClientService.getClientByclient_id(client_id)
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

  private async composeAccessTokenResponse(client: ClientInstance, userAccount: UserAccountInstance): Promise<IAccessTokenResponse> {
    const refresh_token = await this.createRefreshToken(client, userAccount)
    const access_token = await this.createAccessToken(client, userAccount)
    return {
      access_token,
      expires_in: ConfigurationManager.Security.accessTokenExpiresIn,
      refresh_token,
      token_type: 'Bearer'
    }
  }

  private createAccessToken(client: ClientInstance, userAccount: UserAccountInstance): Promise<string> {
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

  private createRefreshToken(client: ClientInstance, userAccount: UserAccountInstance): Promise<string> {
    return new Promise((resolve, reject) => {
      const payload = {
        client_id: client.client_id,
        userAccountId: userAccount.userAccountId
      }
      const options = {
        expiresIn: ConfigurationManager.Security.refreshTokenExpiresIn
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

  private generateAndCacheAuthorizationCode(userAccount: IUserAccount): string {
    const authorizationCode = crypto.randomBytes(64).toString('hex')
    this.localCache.set(authorizationCode, userAccount, 120)
    return authorizationCode
  }

  private getAuthorizationCodeFromCache(code: string): Promise<IUserAccount | undefined> {
    return new Promise((resolve, reject) => {
      this.localCache.get<IUserAccount>(code, (err, userAccount) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(userAccount)
        }
      })
    })
  }

  private verifyToken(client: ClientInstance, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, client.secret || '', (err, payload) => {
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
