import {
  IEmailAddressFilter,
  IEmailAddressMeta,
  IEmailAddressUniqueFilter
} from '../../interfaces/graphql/IEmailAddress'
import { IQueryOptions } from '../../../foundation/models/IQueryOptions'
import { EmailAddress } from '../../../foundation/models/EmailAddress'
import _ from 'lodash'

import { hasPermission } from '../../decorators/permissionDecorator'
import { Permissions } from '../../../foundation/constants/permissions'

import AuthorizationHelper from '../../utils/AuthorizationHelper'
import EmailAddressRepository from '../../data/repositories/EmailAddressRepository'

import { randomBytes } from 'crypto'

import MailService from './MailService'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'
import { IConfiguration } from '../../../foundation/types/types'

class EmailAddressService {
  @hasPermission(Permissions.User)
  public async getEmailAddress(filter: IEmailAddressUniqueFilter, options: IQueryOptions) {
    if (options.userContext && !AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return await EmailAddressRepository.getEmailAddress(filter, options)
  }

  public async isEmailAddressAvailable(emailAddress: string, options: IQueryOptions): Promise<boolean> {
    const existingEmail = await EmailAddressRepository.getEmailAddress({ emailAddress }, options)

    return existingEmail === null
  }

  public async isDomainAllowed(emailAddress: string, configuration: IConfiguration): Promise<boolean> {
    const domain = emailAddress.split('@')[1].toLowerCase()

    if (configuration.Security.domainWhitelist) {
      const allowedDomains = _.compact(configuration.Security.domainWhitelist.toLowerCase().split(';'))

      return allowedDomains.length === 0 || allowedDomains.includes(domain)
    }
    return true
  }

  public async createEmailAddress(data: Partial<EmailAddress>, configuration: IConfiguration, options: IQueryOptions) {
    data.verificationSecret = '' // sendVerificationEmail will set this correctly
    await EmailAddressRepository.createEmailAddress(data as EmailAddress, options)
    if (!data.verified && data.emailAddress) {
      await this.sendVerificationEmail(data.emailAddress, configuration, options)
    }
  }

  public async sendVerificationEmail(emailAddress: string, configuration: IConfiguration, options: IQueryOptions) {
    const verificationSecret = randomBytes(16).toString('hex')

    const data = await EmailAddressRepository.updateEmailAddress({ emailAddress }, { verificationSecret }, options)
    if (data && !data.verified) {
      const userAccount = await UserAccountRepository.getUserAccount({ userAccountId: data.userAccountId }, options)
      return await MailService.sendEmailTemplate(
        `verifyEmailTemplate`,
        data.emailAddress,
        'E-mail Address Verification',
        {
          realmName: configuration.Server.realmName,
          user: userAccount,
          verificationLink: `${configuration.Server.baseUrl}/verify?address=${data.emailAddress}&code=${data.verificationSecret}`
        },
        configuration
      )
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
  public async emailAddressesMeta(
    filter: IEmailAddressFilter | null,
    options: IQueryOptions
  ): Promise<IEmailAddressMeta> {
    if (options.userContext && !AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return EmailAddressRepository.emailAddressesMeta(filter, options)
  }

  @hasPermission(Permissions.User)
  public async getEmailAddresses(filter: IEmailAddressFilter | null, options: IQueryOptions): Promise<EmailAddress[]> {
    if (options.userContext && !AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return EmailAddressRepository.getEmailAddresses(filter, options)
  }
}

export default new EmailAddressService()
