import { IConfigurationMeta, IConfigurationFilter, IConfigurationUniqueFilter } from '@/interfaces/graphql/IConfiguration'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IConfiguration } from '@data/models/IConfiguration'
import { IUserAccount } from '@data/models/IUserAccount'
import { ConfigurationInstance } from '@data/models/Configuration'
import { AnyWhereOptions, Transaction } from 'sequelize'

export default class ConfigurationServiceBase {
  public async configurationsMeta(filter?: IConfigurationFilter, transaction?: Transaction): Promise<IConfigurationMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.Configuration.count({ where, transaction })
    return {
      count
    }
  }

  public async getConfigurations(filter?: IConfigurationFilter, transaction?: Transaction): Promise<ConfigurationInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.Configuration.findAll({
      where,
      raw: true,
      transaction
    })
  }

  public async getConfiguration(filter: IConfigurationUniqueFilter, transaction?: Transaction): Promise<ConfigurationInstance | null> {
    return await db.Configuration.findOne({
      where: filter,
      raw: true,
      transaction
    })
  }

  public async createConfiguration(data: IConfiguration, userContext?: IUserAccount, transaction?: Transaction): Promise<ConfigurationInstance> {
    if (userContext) {
      data.createdBy = userContext.userAccountId
      data.updatedBy = userContext.userAccountId
    }
    return await db.Configuration.create(data, { returning: true, raw: true, transaction })
  }

  public async deleteConfiguration(filter: IConfigurationUniqueFilter, userContext?: IUserAccount, transaction?: Transaction): Promise<boolean> {
    const data: Partial<IConfiguration> = {
      deletedAt: new Date()
    }
    if (userContext) {
      data.deletedBy = userContext.userAccountId
    }
    const [affectedCount] = await db.Configuration.update(data, {
      where: filter as AnyWhereOptions,
      transaction
    })
    return affectedCount > 0
  }

  public async updateConfiguration(filter: IConfigurationUniqueFilter, data: IConfiguration, userContext?: IUserAccount, transaction?: Transaction): Promise<ConfigurationInstance | null> {
    if (userContext) {
      data.updatedBy = userContext.userAccountId
    }
    return await db.Configuration.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction
    }).then(() => this.getConfiguration(filter))
  }
}
