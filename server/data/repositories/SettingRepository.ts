import { ISettingMeta, ISettingFilter, ISettingUniqueFilter } from '../../interfaces/graphql/ISetting'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'

import { Setting } from '../../data/models/Setting'

import { WhereOptions, WhereAttributeHash } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class SettingRepository {
  public async settingsMeta(filter: ISettingFilter | null, options: IQueryOptions): Promise<ISettingMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await Setting.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getSettings(filter: ISettingFilter | null, options: IQueryOptions): Promise<Setting[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await Setting.findAll({
      where,
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results
  }

  public async getSetting(filter: ISettingUniqueFilter, options: IQueryOptions): Promise<Setting | null> {
    const result = await Setting.findOne({
      where: filter as WhereAttributeHash,

      transaction: options.transaction
    })
    if (result) {
      return result
    } else {
      return null
    }
  }

  public async createSetting(data: Partial<Setting>, options: IQueryOptions): Promise<Setting> {
    return await Setting.create(data, { transaction: options.transaction })
  }

  public async updateSetting(
    filter: ISettingUniqueFilter,
    data: Partial<Setting>,
    options: IQueryOptions
  ): Promise<Setting | null> {
    await Setting.update(data, {
      where: filter as WhereOptions,

      transaction: options.transaction
    })
    return await this.getSetting(filter, options)
  }
}

export default new SettingRepository()
