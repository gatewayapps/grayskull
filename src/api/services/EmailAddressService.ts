import { IEmailAddressUniqueFilter, IEmailAddressFilter, IEmailAddressMeta } from '@/interfaces/graphql/IEmailAddress'
import { IQueryOptions } from '../../data/IQueryOptions'
import { IEmailAddress } from '@data/models/IEmailAddress'
import _ from 'lodash'
import { EmailAddressInstance } from '@data/models/EmailAddress'
import { hasPermission } from '@decorators/permissionDecorator'
import { Permissions } from '@/utils/permissions'
import authorization from '@/utils/AuthorizationHelper'
import AuthorizationHelper from '@/utils/AuthorizationHelper'
import EmailAddressRepository from '@data/repositories/EmailAddressRepository'
import ConfigurationManager from '@/config/ConfigurationManager'
import { encrypt } from '@/utils/cipher'
import { authenticator } from 'otplib'
import { randomBytes } from 'crypto'
import { ForbiddenError } from 'apollo-server'
import MailService from './MailService'
import UserAccountRepository from '@data/repositories/UserAccountRepository'

class EmailAddressService {
  @hasPermission(Permissions.User)
  public async getEmailAddress(filter: IEmailAddressUniqueFilter, options: IQueryOptions) {
    if (!AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return await EmailAddressRepository.getEmailAddress(filter, options)
  }

  public async isEmailAddressAvailable(emailAddress: string, options: IQueryOptions): Promise<Boolean> {
    const existingEmail = await EmailAddressRepository.getEmailAddress({ emailAddress }, options)

    return existingEmail === null
  }

  public async createEmailAddress(data: IEmailAddress, options: IQueryOptions) {
    const domain = data.emailAddress.split('@')[1].toLowerCase()
    if (ConfigurationManager.Security!.domainWhitelist) {
      const allowedDomains: string[] = _.compact(JSON.parse(ConfigurationManager.Security!.domainWhitelist.toLowerCase()))
      if (allowedDomains.length > 0 && !allowedDomains.includes(domain) && !allowedDomains.includes(`@${domain}`)) {
        throw new ForbiddenError(`E-mail addresses for @${domain} are not permitted`)
      }
    }

    data.verificationSecret = '' // sendVerificationEmail will set this correctly
    const result = await EmailAddressRepository.createEmailAddress(data, options)

    await this.sendVerificationEmail(data.emailAddress, options)
  }

  public async sendVerificationEmail(emailAddress: string, options: IQueryOptions) {
    const verificationSecret = randomBytes(16).toString('hex')

    const data = await EmailAddressRepository.updateEmailAddress({ emailAddress }, { verificationSecret }, options)
    if (data && !data.verified) {
      const userAccount = await UserAccountRepository.getUserAccount({ userAccountId: data.userAccountId }, options)
      return await MailService.sendEmailTemplate(`verifyEmailTemplate`, data.emailAddress, 'E-mail Address Verification', {
        realmName: ConfigurationManager.Server!.realmName,
        user: userAccount,
        verificationLink: `${ConfigurationManager.Server!.baseUrl}/verify?address=${data.emailAddress}&code=${data.verificationSecret}`
      })
    } else {
      if (data && data.verified) {
        throw new Error('E-mail address already verified')
      } else {
        throw new Error('Invalid e-mail address')
      }
    }
  }

  public async verifyEmailAddress(emailAddress: string, verificationCode: string, options: IQueryOptions) {
    const result = await EmailAddressRepository.getEmailAddress({ emailAddress: emailAddress }, options)
    if (result && result.verificationSecret === verificationCode) {
      await EmailAddressRepository.updateEmailAddress({ emailAddress }, { verified: true }, options)
    } else {
      // Throw the same error no matter what
      throw new Error(`Invalid verification code`)
    }
  }

  @hasPermission(Permissions.User)
  public async emailAddressesMeta(filter: IEmailAddressFilter | null, options: IQueryOptions): Promise<IEmailAddressMeta> {
    if (!AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return EmailAddressRepository.emailAddressesMeta(filter, options)
  }

  @hasPermission(Permissions.User)
  public async getEmailAddresses(filter: IEmailAddressFilter | null, options: IQueryOptions): Promise<IEmailAddress[]> {
    if (!AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return EmailAddressRepository.getEmailAddresses(filter, options)
  }
}

export default new EmailAddressService()
