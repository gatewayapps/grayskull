import bcrypt from 'bcrypt'

import ConfigurationManager from '@/config/ConfigurationManager'
import moment from 'moment'
import UserAccountService from './UserAccountService'

class AuthenticationService {
  public async authenticateUser(emailAddress: string, password: string): Promise<boolean> {
    const existingUser = await UserAccountService.getUserAccountByemailAddressWithSensitiveData(emailAddress)
    if (existingUser) {
      const passwordMatch = await bcrypt.compare(password, existingUser.password_hash)
      return passwordMatch
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

  public async validatePassword(password: string, confirm: string): Promise<boolean> {
    if (password !== confirm) {
      throw new Error('Passwords do not match.  Please re-enter your passwords')
    }
    /*    "passwordRequireLowercase": false,
    "passwordRequireUppercase": false,
    "passwordRequireNumber": false,
    "passwordRequireSymbol": false,
    "passwordMinimumLength": 8,*/

    if (password.length < ConfigurationManager.Security.passwordMinimumLength) {
      throw new Error(`Password must be at least ${ConfigurationManager.Security.passwordMinimumLength} characters long`)
    }
    return true
  }
}

export default new AuthenticationService()
