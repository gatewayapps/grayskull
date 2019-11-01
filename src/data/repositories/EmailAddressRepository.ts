import { IEmailAddressMeta, IEmailAddressFilter, IEmailAddressUniqueFilter } from '../../interfaces/graphql/IEmailAddress'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'
import db from '../../data/context'
import { IEmailAddress } from '../../data/models/IEmailAddress'

import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class EmailAddressRepository {
  public async emailAddressesMeta(filter: IEmailAddressFilter | null, options: IQueryOptions): Promise<IEmailAddressMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.EmailAddress.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getEmailAddresses(filter: IEmailAddressFilter | null, options: IQueryOptions): Promise<IEmailAddress[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await db.EmailAddress.findAll({
      where,
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results.map((r) => r.toJSON())
  }

  public async getEmailAddress(filter: IEmailAddressUniqueFilter, options: IQueryOptions): Promise<IEmailAddress | null> {
    const result = await db.EmailAddress.findOne({
      where: filter,

      transaction: options.transaction
    })
    if (result) {
      return result.toJSON()
    } else {
      return null
    }
  }

  public async createEmailAddress(data: IEmailAddress, options: IQueryOptions): Promise<IEmailAddress> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await db.EmailAddress.create(data, { returning: true, transaction: options.transaction })
  }

  public async deleteEmailAddress(filter: IEmailAddressUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<IEmailAddress> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await db.EmailAddress.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateEmailAddress(filter: IEmailAddressUniqueFilter, data: Partial<IEmailAddress>, options: IQueryOptions): Promise<IEmailAddress | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await db.EmailAddress.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getEmailAddress(filter, options)
  }
}

export default new EmailAddressRepository()
