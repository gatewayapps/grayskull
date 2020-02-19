import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'
import { Permissions } from '../../../foundation/constants/permissions'

import { EmailAddress } from '../../../foundation/models/EmailAddress'
import { UserAccount } from '../../../foundation/models/UserAccount'
import bcrypt from 'bcrypt'

import uuid from 'uuid/v4'
import EmailAddressService from './EmailAddressService'

import { IQueryOptions } from '../../../foundation/models/IQueryOptions'
import { UserAccountFilter, UserAccountMeta } from '../../interfaces/graphql/IUserAccount'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'
import EmailAddressRepository from '../../data/repositories/EmailAddressRepository'
import { randomBytes } from 'crypto'

import { hasPermission } from '../../decorators/permissionDecorator'
import { IConfiguration } from '../../../foundation/types/types'
import { DataContext } from '../../../foundation/context/getDataContext'
import { cacheValue } from '../../../operations/data/persistentCache/cacheValue'
import { getValue } from '../../../operations/data/persistentCache/getValue'
import { sendTemplatedEmail } from '../../../operations/services/mail/sendEmailTemplate'

const INVITATION_EXPIRES_IN = 3600

class UserAccountService {
  public async activateAccount(
    emailAddress: string,
    password: string,
    dataContext: DataContext,
    otpSecret?: string
  ): Promise<void> {
    const options: IQueryOptions = {}

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
        isActive: true,
        passwordHash
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
      await cacheValue(`${emailAddress}_verificiation`, resetToken, INVITATION_EXPIRES_IN, dataContext)

      const user = await UserAccountRepository.createUserAccount(data, options)

      const emailAddressData: Partial<EmailAddress> = {
        userAccountId: user.userAccountId,
        emailAddress: emailAddress,
        primary: true,
        verificationSecret: ''
      }
      await EmailAddressRepository.createEmailAddress(emailAddressData as EmailAddress, options)

      const activateLink = `${configuration.Server.baseUrl}/activate?emailAddress=${emailAddress}&token=${resetToken}`
      await sendTemplatedEmail(
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

  public async updateUserActive(userAccountId: string, options: IQueryOptions) {
    await UserAccountRepository.updateUserAccount({ userAccountId }, { lastActive: new Date() }, options)
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

  public async validateResetPasswordToken(emailAddress: string, token: string, dataContext: DataContext) {
    const cachedValue = await getValue(`${emailAddress}_verification`, dataContext)
    return cachedValue === token
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
