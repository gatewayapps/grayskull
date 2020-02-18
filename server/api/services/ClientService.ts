import { Client } from '../../../foundation/models/Client'

import { IQueryOptions } from '../../../foundation/models/IQueryOptions'

import ClientRepository from '../../data/repositories/ClientRepository'

class ClientService {
  public async validateClient(client_id: string, secret: string, options: IQueryOptions): Promise<Client | null> {
    const client = await ClientRepository.getClientWithSensitiveData({ client_id }, options)
    if (client && client.secret === secret) {
      return client
    }
    return null
  }
}

export default new ClientService()
