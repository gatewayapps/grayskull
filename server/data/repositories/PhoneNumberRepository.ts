import { IPhoneNumberFilter, IPhoneNumberMeta, IPhoneNumberUniqueFilter } from '../../interfaces/graphql/IPhoneNumber'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'
import db from '../../data/context'
import { IPhoneNumber } from '../../data/models/IPhoneNumber'

import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class PhoneNumberRepository {
  public async phoneNumbersMeta(filter: IPhoneNumberFilter | null, options: IQueryOptions): Promise<IPhoneNumberMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.PhoneNumber.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getPhoneNumbers(filter: IPhoneNumberFilter | null, options: IQueryOptions): Promise<IPhoneNumber[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await db.PhoneNumber.findAll({
      where,
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results.map((r) => r.toJSON())
  }

  public async getPhoneNumber(filter: IPhoneNumberUniqueFilter, options: IQueryOptions): Promise<IPhoneNumber | null> {
    const result = await db.PhoneNumber.findOne({
      where: filter,

      transaction: options.transaction
    })
    if (result) {
      return result.toJSON()
    } else {
      return null
    }
  }

  public async createPhoneNumber(data: IPhoneNumber, options: IQueryOptions): Promise<IPhoneNumber> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await db.PhoneNumber.create(data, { returning: true, transaction: options.transaction })
  }

  public async deletePhoneNumber(filter: IPhoneNumberUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<IPhoneNumber> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await db.PhoneNumber.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updatePhoneNumber(filter: IPhoneNumberUniqueFilter, data: Partial<IPhoneNumber>, options: IQueryOptions): Promise<IPhoneNumber | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await db.PhoneNumber.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getPhoneNumber(filter, options)
  }
}

export default new PhoneNumberRepository()
