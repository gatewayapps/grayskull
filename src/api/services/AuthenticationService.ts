import bcrypt from 'bcrypt'
import config from 'config'
import moment from 'moment'
import UserAccountService from './UserAccountService'

const securityOptions: any = config.get('Security')

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
    if (securityOptions.passwordExpiresDays > 0) {
      const userAccount = await UserAccountService.getUserAccountByemailAddress(emailAddress)
      if (userAccount) {
        const lastPasswordChange = userAccount.lastPasswordChange || userAccount.dateCreated!
        const daysSincePasswordChange = Math.abs(moment().diff(lastPasswordChange, 'days'))
        if (daysSincePasswordChange >= securityOptions.passwordExpiresDays) {
          return true
        }
      }
    }
    return false
  }
}

export default new AuthenticationService()
