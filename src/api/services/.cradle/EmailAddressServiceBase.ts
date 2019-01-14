import { IEmailAddressMeta, IEmailAddressFilter, IEmailAddressUniqueFilter } from '@/interfaces/graphql/IEmailAddress'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IEmailAddress } from '@data/models/IEmailAddress'
import { IUserAccount } from '@data/models/IUserAccount'
import { EmailAddressInstance } from '@data/models/EmailAddress'
import { AnyWhereOptions, Transaction } from 'sequelize'

export default class EmailAddressServiceBase {
  public async emailAddressesMeta(filter?: IEmailAddressFilter, transaction?: Transaction): Promise<IEmailAddressMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.EmailAddress.count({ where, transaction })
    return {
      count
    }
  }

  public async getEmailAddresses(filter?: IEmailAddressFilter, transaction?: Transaction): Promise<EmailAddressInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.EmailAddress.findAll({
      where,
      raw: true,
      transaction
    })
  }

  public async getEmailAddress(filter: IEmailAddressUniqueFilter, transaction?: Transaction): Promise<EmailAddressInstance | null> {
    return await db.EmailAddress.findOne({
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
    return await db.EmailAddress.create(data, { returning: true, raw: true, transaction })
  }

  public async deleteEmailAddress(filter: IEmailAddressUniqueFilter, userContext?: IUserAccount, transaction?: Transaction): Promise<boolean> {
    const data: Partial<IEmailAddress> = {
      deletedAt: new Date()
    }
    if (userContext) {
      data.deletedBy = userContext.userAccountId
    }
    const [affectedCount] = await db.EmailAddress.update(data, {
      where: filter as AnyWhereOptions,
      transaction
    })
    return affectedCount > 0
  }

  public async updateEmailAddress(filter: IEmailAddressUniqueFilter, data: IEmailAddress, userContext?: IUserAccount, transaction?: Transaction): Promise<EmailAddressInstance | null> {
    if (userContext) {
      data.updatedBy = userContext.userAccountId
    }
    return await db.EmailAddress.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction
    }).then(() => this.getEmailAddress(filter))
  }
}
