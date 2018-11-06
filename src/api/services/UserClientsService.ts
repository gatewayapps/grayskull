import db from '@data/context'
import { IUserClients } from '@data/models/IUserClients'
import { UserClientsInstance } from '@data/models/UserClients'
import UserClientsServiceBase from '@services/UserClientsServiceBase'

class UserClientsService extends UserClientsServiceBase {
  public async getUserClient(userAccountId: number, client_id: number): Promise<UserClientsInstance | null> {
    return await db.UserClients.find({
      where: {
        userAccountId,
        client_id
      }
    })
  }
}

export default new UserClientsService()
