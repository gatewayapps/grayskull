import db from '@data/context'
import { IUserClients } from '@data/models/IUserClients'
import { UserClientsInstance } from '@data/models/UserClients'

export default class UserClientsServiceBase {
  public async createUserClients(data: IUserClients): Promise<UserClientsInstance> {
    return await db.UserClients.create(data, { returning: true, raw: true })
  }
}
