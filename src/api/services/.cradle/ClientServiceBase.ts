import db from '@data/context'
import { ClientInstance } from '@data/models/Client'
import { IClient } from '@data/models/IClient'

export default class ClientServiceBase {
  public async createClient(data: IClient): Promise<ClientInstance> {
    return await db.Client.create(data, { returning: true, raw: true })
  }
  public async deleteClientByclient_id(client_id: number): Promise<number> {
    return await db.Client.destroy({
      where: {
        client_id
      }
    })
  }
  public async getClientByclient_id(client_id: number): Promise<ClientInstance | null> {
    return await db.Client.findOne({
      where: {
        client_id
      },
      attributes: {
        exclude: ['secret']
      },
      raw: true
    })
  }
  public async getClientByclient_idWithSensitiveData(client_id: number): Promise<ClientInstance | null> {
    return await db.Client.findOne({
      where: {
        client_id
      },
      raw: true
    })
  }
  public async updateClientByclient_id(data: IClient, client_id: number): Promise<ClientInstance | null> {
    return await db.Client.update(data, {
      where: {
        client_id
      },
      returning: true
    }).then(() => {
      return this.getClientByclient_id(client_id)
    })
  }
}
