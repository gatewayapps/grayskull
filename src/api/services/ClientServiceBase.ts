import db from '../../data'
import { ClientInstance } from '../../data/models/Client'
import { IClient } from '../../data/models/IClient'

export default class ClientServiceBase {
  public async createClient(data: IClient): Promise<ClientInstance> {
    return await db.Client.create(data, { returning: true, raw: true })
  }
  public async deleteClientByclientId(clientId: number): Promise<number> {
    return await db.Client.destroy({
      where: {
        clientId
      }
    })
  }
  public async getClientByclientId(clientId: number): Promise<ClientInstance | null> {
    return await db.Client.findOne({
      where: {
        clientId
      },
      raw: true
    })
  }
  public async updateClientByclientId(data: IClient, clientId: number): Promise<ClientInstance | null> {
    return await db.Client.update(data, {
      where: {
        clientId
      },
      returning: true
    }).then(() => {
      return this.getClientByclientId(clientId)
    })
  }
}
