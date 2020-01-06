import { Permissions } from './permissions'

import { UserAccount } from '../data/models/UserAccount'
import { Setting } from '../data/models/Setting'

export async function isOobe(): Promise<boolean> {
  const settingCount = await Setting.count()
  return settingCount === 0
}
export async function needsFirstUser(): Promise<boolean> {
  const userCount = await UserAccount.count()
  return userCount === 0
}

class AuthorizationHelper {
  public isUser(userContext: UserAccount | null): boolean {
    return userContext !== null && userContext.permissions !== undefined && userContext.permissions > Permissions.None
  }
  public isAdmin(userContext: UserAccount | null): boolean {
    return (
      userContext !== null && userContext.permissions !== undefined && userContext.permissions === Permissions.Admin
    )
  }
  public isSelf(userContext: UserAccount | null, userAccountId: string): boolean {
    return userContext !== null && userContext.userAccountId !== null && userContext.userAccountId === userAccountId
  }
}
export default new AuthorizationHelper()
