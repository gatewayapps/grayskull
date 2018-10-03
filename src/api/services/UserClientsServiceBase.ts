import Promise from 'bluebird'
import db from '../../data'
import { IUserClients } from '../../data/models/IUserClients'
import { UserClientsInstance } from '../../data/models/UserClients'

export default class UserClientsServiceBase {
  public createUserClients(data: IUserClients): Promise<UserClientsInstance> {
    return db.UserClients.create(data, { returning: true, raw: true })
  }
}
