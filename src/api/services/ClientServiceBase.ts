import Promise from 'bluebird'
import db from '../../data'
import { IClient } from '../../data/models/IClient'
import { ClientInstance } from '../../data/models/Client'

export default class ClientServiceBase {
    public createClient(data: IClient): Promise<ClientInstance> {
      return db.Client.create(data)
    }

    public deleteClientByclientId(clientId: number): Promise<number> {
      return db.Client.destroy({
        where: {
          clientId
        }
      })
    }

    public getClientByclientId(clientId: number): Promise<ClientInstance | null> {
      return db.Client.findOne({
        where: {
          clientId
        }
      })
    }
}
