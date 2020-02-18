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
