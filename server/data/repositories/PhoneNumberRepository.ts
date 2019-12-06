import { IPhoneNumberMeta, IPhoneNumberFilter, IPhoneNumberUniqueFilter } from '../../interfaces/graphql/IPhoneNumber'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'
import { getContext } from '../../data/context'
import { PhoneNumber } from '../../data/models/IPhoneNumber'

import { WhereOptions, WhereAttributeHash } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class PhoneNumberRepository {
  public async phoneNumbersMeta(filter: IPhoneNumberFilter | null, options: IQueryOptions): Promise<IPhoneNumberMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await PhoneNumber.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getPhoneNumbers(filter: IPhoneNumberFilter | null, options: IQueryOptions): Promise<PhoneNumber[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await PhoneNumber.findAll({
      where,
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results
  }

  public async getPhoneNumber(filter: IPhoneNumberUniqueFilter, options: IQueryOptions): Promise<PhoneNumber | null> {
    const result = await PhoneNumber.findOne({
      where: filter as WhereAttributeHash,

      transaction: options.transaction
    })
    if (result) {
      return result
    } else {
      return null
    }
  }

  public async createPhoneNumber(data: PhoneNumber, options: IQueryOptions): Promise<PhoneNumber> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await PhoneNumber.create(data, { transaction: options.transaction })
  }

  public async deletePhoneNumber(filter: IPhoneNumberUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<PhoneNumber> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await PhoneNumber.update(data, {
      where: filter as WhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updatePhoneNumber(
    filter: IPhoneNumberUniqueFilter,
    data: Partial<PhoneNumber>,
    options: IQueryOptions
  ): Promise<PhoneNumber | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await PhoneNumber.update(data, {
      where: filter as WhereOptions,

      transaction: options.transaction
    })
    return await this.getPhoneNumber(filter, options)
  }
}

export default new PhoneNumberRepository()
