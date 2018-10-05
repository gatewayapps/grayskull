import ConfigurationManager from '@/config/ConfigurationManager'
import ClientService from '@services/ClientService'
import bcrypt from 'bcrypt'
import moment from 'moment'
import NodeCache from 'node-cache'
import UserAccountService from './UserAccountService'

import { IUserAccount } from '@data/models/IUserAccount'
import crypto from 'crypto'

const LOWERCASE_REGEX = /[a-z]/
const UPPERCASE_REGEX = /[A-Z]/
const NUMBER_REGEX = /\d/
const SYMBOL_REGEX = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/

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

  private generateAndCacheAuthorizationCode(userAccount: IUserAccount): string {
    const authorizationCode = crypto.randomBytes(64).toString('hex')
    this.localCache.set(authorizationCode, userAccount, 120)
    return authorizationCode
  }
}

export default new AuthenticationService()
