import { Permissions } from '../../foundation/constants/permissions'

import { UserAccount } from '../../foundation/models/UserAccount'
import { Setting } from '../../foundation/models/Setting'
import { UserContext } from '../../foundation/context/getUserContext'

export async function isOobe(): Promise<boolean> {
  const settingCount = await Setting.count()
  return settingCount === 0
}
export async function needsFirstUser(): Promise<boolean> {
  const userCount = await UserAccount.count()
  return userCount === 0
}

class AuthorizationHelper {
  public isUser(userContext: UserContext): boolean {
    return userContext !== null && userContext.permissions !== undefined && userContext.permissions > Permissions.None
  }
  public isAdmin(userContext: UserContext): boolean {
    return (
      userContext !== null && userContext.permissions !== undefined && userContext.permissions === Permissions.Admin
    )
  }
  public isSelf(userContext: UserContext, userAccountId: string): boolean {
    return userContext !== null && userContext.userAccountId !== null && userContext.userAccountId === userAccountId
  }
}
export default new AuthorizationHelper()
