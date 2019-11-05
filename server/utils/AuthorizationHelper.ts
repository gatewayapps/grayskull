import { IUserAccount } from '../data/models/IUserAccount'
import { Permissions } from './permissions'
import { getContext } from '../data/context'

export async function isOobe(): Promise<boolean> {
  const settingCount = await (await getContext()).Setting.count()
  return settingCount === 0
}
export async function needsFirstUser(): Promise<boolean> {
  const userCount = await (await getContext()).UserAccount.count()
  return userCount === 0
}

class AuthorizationHelper {
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
