import db from '../../data'
import { IUserAccount } from '../../data/models/IUserAccount'
import { UserAccountInstance } from '../../data/models/UserAccount'

export default class UserAccountServiceBase {
  public async createUserAccount(data: IUserAccount): Promise<UserAccountInstance> {
    return await db.UserAccount.create(data, { returning: true, raw: true })
  }

  public async deleteUserAccountByemailAddress(emailAddress: string): Promise<number> {
    return await db.UserAccount.destroy({
      where: {
        emailAddress
      }
    })
  }

  public async getUserAccountByemailAddress(emailAddress: string): Promise<UserAccountInstance | null> {
    return await db.UserAccount.findOne({
      where: {
        emailAddress
      },
      raw: true
    })
  }
  public async updateUserAccountByemailAddress(data: IUserAccount, emailAddress: string): Promise<UserAccountInstance | null> {
    return await db.UserAccount.update(data, {
      where: {
        emailAddress
      },
      returning: true
    }).then(() => {
      return this.getUserAccountByemailAddress(emailAddress)
    })
  }
  public async deleteUserAccountByuserAccountId(userAccountId: number): Promise<number> {
    return await db.UserAccount.destroy({
      where: {
        userAccountId
      }
    })
  }
  public async getUserAccountByuserAccountId(userAccountId: number): Promise<UserAccountInstance | null> {
    return await db.UserAccount.findOne({
      where: {
        userAccountId
      },
      raw: true
    })
  }
  public async updateUserAccountByuserAccountId(data: IUserAccount, userAccountId: number): Promise<UserAccountInstance | null> {
    return await db.UserAccount.update(data, {
      where: {
        userAccountId
      },
      returning: true
    }).then(() => {
      return this.getUserAccountByuserAccountId(userAccountId)
    })
  }
}
