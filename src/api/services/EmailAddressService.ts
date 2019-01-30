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
    return await EmailAddressRepository.createEmailAddress(data, options)
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
