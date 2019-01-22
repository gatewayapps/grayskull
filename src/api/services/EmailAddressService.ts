import EmailAddressServiceBase from '@services/EmailAddressServiceBase'
import { IEmailAddressUniqueFilter, IEmailAddressFilter, IEmailAddressMeta } from '@/interfaces/graphql/IEmailAddress'
import { IServiceOptions } from './IServiceOptions'
import { IEmailAddress } from '@data/models/IEmailAddress'

import { EmailAddressInstance } from '@data/models/EmailAddress'

class EmailAddressService extends EmailAddressServiceBase {
  public getEmailAddress(filter: IEmailAddressUniqueFilter, options: IServiceOptions) {
    return super.getEmailAddress(filter, options)
  }

  public createEmailAddress(data: IEmailAddress, options: IServiceOptions) {
    return super.createEmailAddress(data, options)
  }

  //TODO: Must be admin or filter to self
  public async emailAddressesMeta(filter: IEmailAddressFilter | null, options: IServiceOptions): Promise<IEmailAddressMeta> {
    return super.emailAddressesMeta(filter, options)
  }

  //TODO: Must be admin or filter to self
  public async getEmailAddresses(filter: IEmailAddressFilter | null, options: IServiceOptions): Promise<EmailAddressInstance[]> {
    return super.getEmailAddresses(filter, options)
  }
}

export default new EmailAddressService()
