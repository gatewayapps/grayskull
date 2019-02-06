import ConfigurationManager from '@/config/ConfigurationManager'
import { GrayskullError, GrayskullErrorCode } from '@/GrayskullError'
import { Permissions } from '@/utils/permissions'
import { encrypt } from '@/utils/cipher'
import db from '@data/context'
import { ClientInstance } from '@data/models/Client'
import { IEmailAddress } from '@data/models/IEmailAddress'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import Cache from 'node-cache'

import uuid from 'uuid/v4'
import ClientService from './ClientService'
import EmailAddressService from './EmailAddressService'
import MailService from './MailService'
import { IQueryOptions } from '../../data/IQueryOptions'
import { IUserAccountUniqueFilter, IUserAccountFilter, IUserAccountMeta } from '@/interfaces/graphql/IUserAccount'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { hasPermission } from '@decorators/permissionDecorator'
import AuthorizationHelper from '@/utils/AuthorizationHelper'
import UserAccountRepository from '@data/repositories/UserAccountRepository'
import EmailAddressRepository from '@data/repositories/EmailAddressRepository'
import ClientRepository from '@data/repositories/ClientRepository'
import AuthenticationService from './AuthenticationService'
import { authenticator } from 'otplib'
import { randomBytes } from 'crypto'
import { ConfigurationService } from './ConfigurationService'

const INVITATION_EXPIRES_IN = 3600

const TokenCache = new Cache({ stdTTL: INVITATION_EXPIRES_IN })

interface ICPTToken {
  client: ClientInstance | { name: string; client_id: string } | null
  emailAddress: string
  invitedById?: number
}

class UserAccountService {
  /**
   *
   * @param data
   * @param password
   */
  public async createUserAccountWithPassword(data: IUserAccount, password: string, options: IQueryOptions): Promise<IUserAccount> {
    data.userAccountId = uuid()
    data.passwordHash = await this.hashPassword(password)
    data.lastPasswordChange = new Date()
    if (data.otpSecret && data.otpSecret.length > 0) {
      data.otpSecret = encrypt(data.otpSecret)
      data.otpEnabled = true
    }
    return UserAccountRepository.createUserAccount(data, options)
  }

  public async changeUserPassword(userAccountId: string, password: string, options: IQueryOptions) {
    const passwordHash = await this.hashPassword(password)
    await UserAccountRepository.updateUserAccount(
      { userAccountId },
      { passwordHash, lastPasswordChange: new Date(), resetPasswordToken: null, resetPasswordTokenExpiresAt: null },
      options
    )
  }

  public async getUserAccountByEmailAddress(emailAddress: string, options: IQueryOptions): Promise<IUserAccount | null> {
    const email = await EmailAddressRepository.getEmailAddress({ emailAddress }, options)

    if (!email) {
      return null
    }
    return this.getUserAccount({ userAccountId: email.userAccountId }, options)
  }

  public async userAccountsMeta(filter: IUserAccountFilter | null, options: IQueryOptions): Promise<IUserAccountMeta> {
    return UserAccountRepository.userAccountsMeta(filter, options)
  }

  // This seems not right.  This call should be admin only, but we have to expose it for
  // authentication.  As long as it's never exposed via an API it should be ok I guess.
  public async getUserAccountByEmailAddressWithSensitiveData(emailAddress: string, options: IQueryOptions): Promise<IUserAccount | null> {
    const email = await EmailAddressRepository.getEmailAddress({ emailAddress }, options)

    if (!email) {
      return null
    }

    return UserAccountRepository.getUserAccountWithSensitiveData({ userAccountId: email.userAccountId }, options)
  }

  public async getUserAccount(filter: IUserAccountUniqueFilter, options: IQueryOptions): Promise<IUserAccount | null> {
    return UserAccountRepository.getUserAccount(filter, options)
  }

  public async validateResetPasswordToken(emailAddress: string, token: string, options: IQueryOptions) {
    const userAccount = await this.getUserAccountByEmailAddressWithSensitiveData(emailAddress, options)
    if (!userAccount || !userAccount.resetPasswordToken || !userAccount.resetPasswordTokenExpiresAt) {
      return false
    }
    if (userAccount.resetPasswordToken !== token || userAccount.resetPasswordTokenExpiresAt < new Date()) {
      return false
    }
    return true
  }

  public async resetPassword(emailAddress: string, options: IQueryOptions) {
    const userAccount = await this.getUserAccountByEmailAddress(emailAddress, options)
    if (userAccount) {
      const resetToken = randomBytes(16).toString('hex')

      const expirationTime = moment().add(INVITATION_EXPIRES_IN, 'seconds')

      userAccount.resetPasswordToken = resetToken
      userAccount.resetPasswordTokenExpiresAt = expirationTime.toDate()

      await UserAccountRepository.updateUserAccount({ userAccountId: userAccount.userAccountId }, userAccount, options)

      const resetPasswordLink = `${ConfigurationManager.Server!.baseUrl}/changePassword?emailAddress=${emailAddress}&token=${resetToken}`
      await MailService.sendEmailTemplate('resetPasswordTemplate', emailAddress, `${ConfigurationManager.Server!.realmName} Password Reset`, {
        resetLink: resetPasswordLink,
        realmName: ConfigurationManager.Server!.realmName,
        user: userAccount
      })
    }

    //MailService.sendMail(emailAddress, `Password Reset Instructions`, body)
  }

  public async registerUser(data: IUserAccount, emailAddress: string, password: string, options: IQueryOptions): Promise<IUserAccount> {
    // 1. Verify that a user has not already been registered with this email address
    const emailAddressAvailable = await EmailAddressService.isEmailAddressAvailable(emailAddress, options)
    if (!emailAddressAvailable) {
      throw new GrayskullError(GrayskullErrorCode.EmailAlreadyRegistered, 'The email address has already been registered')
    }
    const newOptions = Object.assign({}, options)
    // 2. Start a transaction
    newOptions.transaction = await db.sequelize.transaction()

    try {
      // First user is always an administrator
      const userMeta = await UserAccountRepository.userAccountsMeta(null, newOptions)
      // 3. Create the user account
      data.permissions = userMeta.count === 0 ? Permissions.Admin : Permissions.User
      const user = await this.createUserAccountWithPassword(data, password, newOptions)

      // 4. Create the user account email
      const emailAddressData: IEmailAddress = {
        userAccountId: user.userAccountId!,
        emailAddress: emailAddress,
        primary: true,
        verificationSecret: ''
      }
      await EmailAddressService.createEmailAddress(emailAddressData, newOptions)

      // 5. Commit the transaction
      await newOptions.transaction.commit()

      return user
    } catch (err) {
      await newOptions.transaction.rollback()
      throw err
    }
  }

  private hashPassword(password: string): Promise<string> {
    const PASSWORD_SALT_ROUNDS = 10

    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
  }
}

export default new UserAccountService()
