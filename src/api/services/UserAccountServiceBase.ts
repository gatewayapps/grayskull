import Promise from 'bluebird'
import db from '../../data'
import { IUserAccount } from '../../data/models/IUserAccount'
import { UserAccountInstance } from '../../data/models/UserAccount'

export default class UserAccountServiceBase {
    public createUserAccount(data: IUserAccount): Promise<UserAccountInstance> {
      return db.UserAccount.create(data)
    }

    public deleteUserAccountByuserAccountId(userAccountId: number): Promise<number> {
      return db.UserAccount.destroy({
        where: {
          userAccountId
        }
      })
    }

    public getUserAccountByuserAccountId(userAccountId: number): Promise<UserAccountInstance | null> {
      return db.UserAccount.findOne({
        where: {
          userAccountId
        }
      })
    }
}
