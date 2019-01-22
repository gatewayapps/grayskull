import { ISessionMeta, ISessionFilter, ISessionUniqueFilter } from '@/interfaces/graphql/ISession'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'
import { ISession } from '@data/models/ISession'
import { SessionInstance } from '@data/models/Session'
import { AnyWhereOptions } from 'sequelize'
import { IServiceOptions } from '@services/IServiceOptions'

export default class SessionServiceBase {
  protected async sessionsMeta(filter: ISessionFilter | null, options: IServiceOptions): Promise<ISessionMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await getContext().Session.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  protected async getSessions(filter: ISessionFilter | null, options: IServiceOptions): Promise<SessionInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().Session.findAll({
      where,
      raw: true,
      transaction: options.transaction
    })
  }

  protected async getSession(filter: ISessionUniqueFilter, options: IServiceOptions): Promise<SessionInstance | null> {
    return await getContext().Session.findOne({
      where: filter,
      raw: true,
      transaction: options.transaction
    })
  }

  protected async createSession(data: ISession, options: IServiceOptions): Promise<SessionInstance> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await getContext().Session.create(data, { returning: true, raw: true, transaction: options.transaction })
  }

  protected async deleteSession(filter: ISessionUniqueFilter, options: IServiceOptions): Promise<boolean> {
    const affectedCount = await getContext().Session.destroy({
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  protected async updateSession(filter: ISessionUniqueFilter, data: Partial<ISession>, options: IServiceOptions): Promise<SessionInstance | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await getContext().Session.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getSession(filter, options)
  }
}
