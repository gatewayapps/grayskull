import Promise from 'bluebird'
import db from '../../data'
import { IUserAccount } from '../../data/models/IUserAccount'
import { UserAccountInstance } from '../../data/models/UserAccount'

export default class UserAccountServiceBase {
  public createUserAccount(data: IUserAccount): Promise<UserAccountInstance> {
    return db.UserAccount.create(data, { returning: true, raw: true })
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
      },
      raw: true
    })
  }

  public updateUserAccountByuserAccountId(data: IUserAccount, userAccountId: number): Promise<UserAccountInstance | null> {
    return db.UserAccount.update(data, {
      where: {
        userAccountId
      },
      returning: true,
      plain: true,
      raw: true
    })
  }
}
