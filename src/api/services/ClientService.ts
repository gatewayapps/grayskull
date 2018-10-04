import crypto from 'crypto'
import { ClientInstance } from '../../data/models/Client'
import { IClient } from '../../data/models/IClient'
import ClientServiceBase from './.cradle/ClientServiceBase'

class ClientService extends ClientServiceBase {
  public async createClient(data: IClient): Promise<ClientInstance> {
    if (!data.secret) {
      data.secret = crypto.randomBytes(32).toString('hex')
    }
    return super.createClient(data)
  }

  public async getClientByclientId(clientId: number): Promise<ClientInstance | null> {
    const client = await super.getClientByclientId(clientId)
    if (client) {
      delete client.secret
    }
    return client
  }
}

export default new ClientService()
