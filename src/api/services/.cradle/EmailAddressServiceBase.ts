import { IEmailAddressMeta, IEmailAddressFilter, IEmailAddressUniqueFilter } from '@/interfaces/graphql/IEmailAddress'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'
import { IEmailAddress } from '@data/models/IEmailAddress'
import { IUserAccount } from '@data/models/IUserAccount'
import { EmailAddressInstance } from '@data/models/EmailAddress'
import { AnyWhereOptions, Transaction } from 'sequelize'

export default class EmailAddressServiceBase {
  public async emailAddressesMeta(filter?: IEmailAddressFilter, transaction?: Transaction): Promise<IEmailAddressMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await getContext().EmailAddress.count({ where, transaction })
    return {
      count
    }
  }

  public async getEmailAddresses(filter?: IEmailAddressFilter, transaction?: Transaction): Promise<EmailAddressInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().EmailAddress.findAll({
      where,
      raw: true,
      transaction
    })
  }

  public async getEmailAddress(filter: IEmailAddressUniqueFilter, transaction?: Transaction): Promise<EmailAddressInstance | null> {
    return await getContext().EmailAddress.findOne({
      where: filter,
      raw: true,
      transaction
    })
  }

  public async createEmailAddress(data: IEmailAddress, userContext?: IUserAccount, transaction?: Transaction): Promise<EmailAddressInstance> {
    if (userContext) {
      data.createdBy = userContext.userAccountId
      data.updatedBy = userContext.userAccountId
    }
    return await getContext().EmailAddress.create(data, { returning: true, raw: true, transaction })
  }

  public async deleteEmailAddress(filter: IEmailAddressUniqueFilter, userContext?: IUserAccount, transaction?: Transaction): Promise<boolean> {
    const data: Partial<IEmailAddress> = {
      deletedAt: new Date()
    }
    if (userContext) {
      data.deletedBy = userContext.userAccountId
    }
    const [affectedCount] = await getContext().EmailAddress.update(data, {
      where: filter as AnyWhereOptions,
      transaction
    })
    return affectedCount > 0
  }

  public async updateEmailAddress(filter: IEmailAddressUniqueFilter, data: Partial<IEmailAddress>, userContext?: IUserAccount, transaction?: Transaction): Promise<EmailAddressInstance | null> {
    if (userContext) {
      data.updatedBy = userContext.userAccountId
    }
    return await getContext()
      .EmailAddress.update(data, {
        where: filter as AnyWhereOptions,
        returning: true,
        transaction
      })
      .then(() => this.getEmailAddress(filter))
  }
}
