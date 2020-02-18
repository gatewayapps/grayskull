import uuid from 'uuid'
import { UserAccount } from '../../../foundation/models/UserAccount'
import { DataContext } from '../../../foundation/context/getDataContext'
import bcrypt from 'bcrypt'
import { encrypt } from '../../logic/encryption'
import { UserContext } from '../../../foundation/context/getUserContext'

export async function createUserAccount(
  data: Partial<UserAccount>,
  password: string | undefined,
  dataContext: DataContext,
  userContext: UserContext | undefined
) {
  if (data.permissions === undefined) {
    throw new Error('Permissions must be specified when a user is created')
  }
  if (data.otpEnabled === undefined) {
    throw new Error('otpEnabled must be specified when a user is created')
  }
  if (data.isActive === undefined) {
    throw new Error('isActive must be specified when a user is created')
  }
  if (data.firstName === undefined) {
    throw new Error('firstName must be specified when a user is created')
  }
  if (data.lastName === undefined) {
    throw new Error('lastName must be specified when a user is created')
  }

  data.userAccountId = uuid()
  if (password) {
    data.passwordHash = await bcrypt.hash(password, 10)
  }
  data.lastPasswordChange = new Date()
  data.lastActive = new Date()

  if (data.otpSecret && data.otpSecret.length > 0) {
    data.otpSecret = encrypt(data.otpSecret)
    data.otpEnabled = true
  }
  if (userContext) {
    data.createdBy = userContext.userAccountId
  }

  data.createdAt = new Date()
  data.updatedAt = new Date()

  return await new dataContext.UserAccount(data).save()
}
