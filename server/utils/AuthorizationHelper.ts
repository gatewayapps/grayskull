import { IUserAccount } from '../data/models/IUserAccount'
import { Permissions } from './permissions'
import { getContext } from '../data/context'

class AuthorizationHelper {
  public async isOobe(userContext: IUserAccount | null): Promise<boolean> {
    const userCount = await (await getContext()).UserAccount.count()
    return userCount === 0
  }

  public isUser(userContext: IUserAccount | null): boolean {
    return userContext !== null && userContext.permissions !== undefined && userContext.permissions > Permissions.None
  }
  public isAdmin(userContext: IUserAccount | null): boolean {
    return userContext !== null && userContext.permissions !== undefined && userContext.permissions === Permissions.Admin
  }
  public isSelf(userContext: IUserAccount | null, userAccountId: string): boolean {
    return userContext !== null && userContext.userAccountId !== null && userContext.userAccountId === userAccountId
  }
}
export default new AuthorizationHelper()
