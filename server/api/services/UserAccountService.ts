import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'
import { Permissions } from '../../../foundation/constants/permissions'
import { encrypt } from '../../utils/cipher'

import { EmailAddress } from '../../../foundation/models/EmailAddress'
import { UserAccount } from '../../../foundation/models/UserAccount'
import bcrypt from 'bcrypt'
import moment from 'moment'
import uuid from 'uuid/v4'
import EmailAddressService from './EmailAddressService'
import MailService from './MailService'
import { IQueryOptions } from '../../../foundation/models/IQueryOptions'
import { UserAccountFilter, UserAccountMeta, UserAccountUniqueFilter } from '../../interfaces/graphql/IUserAccount'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'
import EmailAddressRepository from '../../data/repositories/EmailAddressRepository'
import { randomBytes } from 'crypto'
import { ForbiddenError } from 'apollo-server'
import { hasPermission } from '../../decorators/permissionDecorator'
import { IConfiguration } from '../../../foundation/types/types'
import { DataContext } from '../../../foundation/context/getDataContext'

const INVITATION_EXPIRES_IN = 3600

class UserAccountService {
  public async activateAccount(
    emailAddress: string,
    password: string,
    dataContext: DataContext,
    otpSecret?: string
  ): Promise<void> {
    const options: IQueryOptions = {
      userContext: null
    }

    const userAccount = await this.getUserAccountByEmailAddressWithSensitiveData(emailAddress, options)
    if (!userAccount) {
      throw new Error('Unable to find a user with that email address')
    }

    options.transaction = await dataContext.sequelize.transaction()

    try {
      const passwordHash = await this.hashPassword(password)

      const updates: Partial<UserAccount> = {
        otpEnabled: !!otpSecret,
        otpSecret,
        passwordHash,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null
      }

      await UserAccountRepository.updateUserAccount({ userAccountId: userAccount.userAccountId }, updates, options)

      await EmailAddressRepository.updateEmailAddress({ emailAddress }, { verified: true }, options)

      await options.transaction.commit()
    } catch (err) {
      await options.transaction.rollback()
      throw err
    }
  }

  @hasPermission(Permissions.Admin)
  public async createUserAccount(
    data: UserAccount,
    emailAddress: string,
    configuration: IConfiguration,
    dataContext: DataContext,
    options: IQueryOptions
  ): Promise<UserAccount> {
    const emailAddressAvailable = await EmailAddressService.isEmailAddressAvailable(emailAddress, options)
    if (!emailAddressAvailable) {
      throw new GrayskullError(
        GrayskullErrorCode.EmailAlreadyRegistered,
        'The email address has already been registered'
      )
    }

    if (!configuration.Server) {
      throw new Error('Failed to load Server configuration')
    }

    options.transaction = await dataContext.sequelize.transaction()

    try {
      data.userAccountId = uuid()
      data.passwordHash = ''
      data.lastPasswordChange = new Date('1900-01-01')

      const resetToken = randomBytes(16).toString('hex')
      const expirationTime = moment().add(INVITATION_EXPIRES_IN, 'seconds')
      data.resetPasswordToken = resetToken
      data.resetPasswordTokenExpiresAt = expirationTime.toDate()

      const user = await UserAccountRepository.createUserAccount(data, options)

      const emailAddressData: Partial<EmailAddress> = {
        userAccountId: user.userAccountId,
        emailAddress: emailAddress,
        primary: true,
        verificationSecret: ''
      }
      await EmailAddressRepository.createEmailAddress(emailAddressData as EmailAddress, options)

      const activateLink = `${configuration.Server.baseUrl}/activate?emailAddress=${emailAddress}&token=${resetToken}`
      await MailService.sendEmailTemplate(
        'activateAccountTemplate',
        emailAddress,
        `Activate Your ${configuration.Server.realmName} Account`,
        {
          activateLink,
          realmName: configuration.Server.realmName,
          user: user,
          createdBy: options.userContext
        },
        configuration
      )

      await options.transaction.commit()

      return user
    } catch (err) {
      await options.transaction.rollback()
      throw err
    }
  }

  /**
   *
   * @param data
   * @param password
   */
  public async createUserAccountWithPassword(
    data: UserAccount,
    password: string,
    options: IQueryOptions
  ): Promise<UserAccount> {
    data.userAccountId = uuid()
    data.passwordHash = await this.hashPassword(password)
    data.lastPasswordChange = new Date()
    if (data.otpSecret && data.otpSecret.length > 0) {
      data.otpSecret = encrypt(data.otpSecret)
      data.otpEnabled = true
    }
    return UserAccountRepository.createUserAccount(data, options)
  }

  public async updateUserActive(userAccountId: string, options: IQueryOptions) {
    await UserAccountRepository.updateUserAccount({ userAccountId }, { lastActive: new Date() }, options)
  }

  public async changeUserPassword(userAccountId: string, password: string, options: IQueryOptions) {
    const passwordHash = await this.hashPassword(password)
    await UserAccountRepository.updateUserAccount(
      { userAccountId },
      { passwordHash, lastPasswordChange: new Date(), resetPasswordToken: null, resetPasswordTokenExpiresAt: null },
      options
    )
  }

  public async getUserAccountByEmailAddress(emailAddress: string, options: IQueryOptions): Promise<UserAccount | null> {
    const email = await EmailAddressRepository.getEmailAddress({ emailAddress }, options)

    if (!email) {
      return null
    }
    return this.getUserAccount({ userAccountId: email.userAccountId }, options)
  }

  public async userAccountsMeta(filter: UserAccountFilter | null, options: IQueryOptions): Promise<UserAccountMeta> {
    return UserAccountRepository.userAccountsMeta(filter, options)
  }

  // This seems not right.  This call should be admin only, but we have to expose it for
  // authentication.  As long as it's never exposed via an API it should be ok I guess.
  public async getUserAccountByEmailAddressWithSensitiveData(
    emailAddress: string,
    options: IQueryOptions
  ): Promise<UserAccount | null> {
    const email = await EmailAddressRepository.getEmailAddress({ emailAddress }, options)

    if (!email) {
      return null
    }

    return UserAccountRepository.getUserAccountWithSensitiveData({ userAccountId: email.userAccountId }, options)
  }

  public async getUserAccount(filter: UserAccountUniqueFilter, options: IQueryOptions): Promise<UserAccount | null> {
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

  public async resetPassword(emailAddress: string, configuration: IConfiguration, options: IQueryOptions) {
    if (!configuration.Server) {
      throw new Error('Failed to load Server configuration')
    }
    const userAccount = await this.getUserAccountByEmailAddress(emailAddress, options)
    if (userAccount) {
      const resetToken = randomBytes(16).toString('hex')

      const expirationTime = moment().add(INVITATION_EXPIRES_IN, 'seconds')

      userAccount.resetPasswordToken = resetToken
      userAccount.resetPasswordTokenExpiresAt = expirationTime.toDate()

      await UserAccountRepository.updateUserAccount({ userAccountId: userAccount.userAccountId }, userAccount, options)

      const resetPasswordLink = `${configuration.Server.baseUrl}/changePassword?emailAddress=${emailAddress}&token=${resetToken}`
      await MailService.sendEmailTemplate(
        'resetPasswordTemplate',
        emailAddress,
        `${configuration.Server.realmName} Password Reset`,
        {
          resetLink: resetPasswordLink,
          realmName: configuration.Server.realmName,
          user: userAccount
        },
        configuration
      )
    }

    //MailService.sendMail(emailAddress, `Password Reset Instructions`, body)
  }

  public async registerUser(
    data: UserAccount,
    emailAddress: string,
    password: string,
    configuration: IConfiguration,
    dataContext: DataContext,
    options: IQueryOptions
  ): Promise<UserAccount> {
    if ((await EmailAddressService.isDomainAllowed(emailAddress, configuration)) === false) {
      throw new ForbiddenError(`Self registration is not permitted for your email domain`)
    }

    // 1. Verify that a user has not already been registered with this email address
    const emailAddressAvailable = await EmailAddressService.isEmailAddressAvailable(emailAddress, options)
    if (!emailAddressAvailable) {
      throw new GrayskullError(
        GrayskullErrorCode.EmailAlreadyRegistered,
        'The email address has already been registered'
      )
    }
    let newOptions: IQueryOptions
    if (options.userContext) {
      newOptions = Object.assign({}, options)
    } else {
      newOptions = { userContext: null }
    }

    // 2. Start a transaction
    newOptions.transaction = await dataContext.sequelize.transaction()

    try {
      // First user is always an administrator
      const userMeta = await UserAccountRepository.userAccountsMeta(null, newOptions)
      data.permissions = userMeta.count === 0 ? Permissions.Admin : Permissions.User

      // 3. Create the user account
      const user = await this.createUserAccountWithPassword(data, password, newOptions)

      // 4. Create the user account email
      const emailAddressData: Partial<EmailAddress> = {
        userAccountId: user.userAccountId,
        emailAddress: emailAddress,
        primary: true,
        verificationSecret: '',
        verified: userMeta.count === 0 // First user account gets verified
      }
      await EmailAddressService.createEmailAddress(emailAddressData, configuration, newOptions)

      // 5. Commit the transaction

      await newOptions.transaction.commit()

      return user
    } catch (err) {
      await newOptions.transaction.rollback()
      throw err
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const PASSWORD_SALT_ROUNDS = 10

    try {
      const result = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
      return result
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

export default new UserAccountService()
