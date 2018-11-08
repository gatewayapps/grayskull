import { ISessionMeta, ISessionFilter, ISessionUniqueFilter } from '@/interfaces/graphql/ISession'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { ISession } from '@data/models/ISession'
import { SessionInstance } from '@data/models/Session'
import { AnyWhereOptions } from 'sequelize'

export default class SessionServiceBase {
  public async sessionsMeta(filter?: ISessionFilter): Promise<ISessionMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.Session.count({ where })
    return {
      count
    }
  }

  public async getSessions(filter?: ISessionFilter): Promise<SessionInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.Session.findAll({
      where,
      raw: true
    })
  }

  public async getSession(filter: ISessionUniqueFilter): Promise<SessionInstance | null> {
    return await db.Session.findOne({
      where: filter,
      raw: true
    })
  }

  public async createSession(data: ISession): Promise<SessionInstance> {
    return await db.Session.create(data, { returning: true, raw: true })
  }

  public async deleteSession(filter: ISessionUniqueFilter): Promise<number> {
    return await db.Session.destroy({
      where: filter as AnyWhereOptions
    })
  }

  public async updateSession(filter: ISessionUniqueFilter, data: ISession): Promise<SessionInstance | null> {
    return await db.Session.update(data, {
      where: filter as AnyWhereOptions,
      returning: true
    }).then(() => this.getSession(filter))
  }
}
