import {
  IEmailAddressMeta,
  IEmailAddressFilter,
  IEmailAddressUniqueFilter
} from '../../interfaces/graphql/IEmailAddress'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'
import { getContext } from '../../data/context'
import { EmailAddress } from '../../data/models/IEmailAddress'

import { WhereOptions, WhereAttributeHash } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class EmailAddressRepository {
  public async emailAddressesMeta(
    filter: IEmailAddressFilter | null,
    options: IQueryOptions
  ): Promise<IEmailAddressMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await EmailAddress.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getEmailAddresses(filter: IEmailAddressFilter | null, options: IQueryOptions): Promise<EmailAddress[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await EmailAddress.findAll({
      where,
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results
  }

  public async getEmailAddress(
    filter: IEmailAddressUniqueFilter,
    options: IQueryOptions
  ): Promise<EmailAddress | null> {
    const result = await EmailAddress.findOne({
      where: filter as WhereAttributeHash,

      transaction: options.transaction
    })
    if (result) {
      return result
    } else {
      return null
    }
  }

  public async createEmailAddress(data: EmailAddress, options: IQueryOptions): Promise<EmailAddress> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await EmailAddress.create(data, { transaction: options.transaction })
  }

  public async deleteEmailAddress(filter: IEmailAddressUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<EmailAddress> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await EmailAddress.update(data, {
      where: filter as WhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateEmailAddress(
    filter: IEmailAddressUniqueFilter,
    data: Partial<EmailAddress>,
    options: IQueryOptions
  ): Promise<EmailAddress | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await EmailAddress.update(data, {
      where: filter as WhereOptions,

      transaction: options.transaction
    })
    return await this.getEmailAddress(filter, options)
  }
}

export default new EmailAddressRepository()
