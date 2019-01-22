import { IEmailAddressUniqueFilter, IEmailAddressFilter, IEmailAddressMeta } from '@/interfaces/graphql/IEmailAddress'
import { IQueryOptions } from '../../data/IQueryOptions'
import { IEmailAddress } from '@data/models/IEmailAddress'

import { EmailAddressInstance } from '@data/models/EmailAddress'
import { hasPermission } from '@decorators/permissionDecorator'
import { Permissions } from '@/utils/permissions'
import authorization from '@/utils/AuthorizationHelper'
import AuthorizationHelper from '@/utils/AuthorizationHelper'
import EmailAddressRepository from '@data/repositories/EmailAddressRepository'

class EmailAddressService {
  @hasPermission(Permissions.User)
  public getEmailAddress(filter: IEmailAddressUniqueFilter, options: IQueryOptions) {
    if (!AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return EmailAddressRepository.getEmailAddress(filter, options)
  }

  public emailAddressExists(emailAddress: string, options: IQueryOptions) {
    return EmailAddressRepository.getEmailAddress({ emailAddress }, options) !== undefined
  }

  public createEmailAddress(data: IEmailAddress, options: IQueryOptions) {
    return EmailAddressRepository.createEmailAddress(data, options)
  }

  @hasPermission(Permissions.User)
  public async emailAddressesMeta(filter: IEmailAddressFilter | null, options: IQueryOptions): Promise<IEmailAddressMeta> {
    if (!AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return EmailAddressRepository.emailAddressesMeta(filter, options)
  }

  @hasPermission(Permissions.User)
  public async getEmailAddresses(filter: IEmailAddressFilter | null, options: IQueryOptions): Promise<EmailAddressInstance[]> {
    if (!AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return EmailAddressRepository.getEmailAddresses(filter, options)
  }
}

export default new EmailAddressService()
