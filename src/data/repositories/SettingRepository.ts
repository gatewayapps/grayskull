import { ISettingMeta, ISettingFilter, ISettingUniqueFilter } from '../../interfaces/graphql/ISetting'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'
import db from '../../data/context'
import { ISetting } from '../../data/models/ISetting'

import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class SettingRepository {
  public async settingsMeta(filter: ISettingFilter | null, options: IQueryOptions): Promise<ISettingMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.Setting.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getSettings(filter: ISettingFilter | null, options: IQueryOptions): Promise<ISetting[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await db.Setting.findAll({
      where,
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results.map((r) => r.toJSON())
  }

  public async getSetting(filter: ISettingUniqueFilter, options: IQueryOptions): Promise<ISetting | null> {
    const result = await db.Setting.findOne({
      where: filter,

      transaction: options.transaction
    })
    if (result) {
      return result.toJSON()
    } else {
      return null
    }
  }

  public async createSetting(data: ISetting, options: IQueryOptions): Promise<ISetting> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await db.Setting.create(data, { returning: true, transaction: options.transaction })
  }

  public async deleteSetting(filter: ISettingUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<ISetting> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await db.Setting.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateSetting(filter: ISettingUniqueFilter, data: Partial<ISetting>, options: IQueryOptions): Promise<ISetting | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await db.Setting.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getSetting(filter, options)
  }
}

export default new SettingRepository()
