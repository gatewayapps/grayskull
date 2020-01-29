import { RegisterUserOperationArgs } from '../foundation/types/types'
import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { DataContext } from '../foundation/context/getDataContext'
import { CacheContext } from '../foundation/context/getCacheContext'

export async function registerUserAccountActivity(
  userDetails: RegisterUserOperationArgs,
  dataContext: DataContext,
  cacheContext: CacheContext
) {
  /*
    1.  Does a user with the given email address exist
    2.  Does the password meet complexity requirements
    3.  Validate userDetails
    4.  Create user in database
    5.  Create email address in database associated with new user account
    6.  Send verification email
    7.  Return success
  */

  const existingUser = await getUserAccountByEmailAddress(userDetails.emailAddress, dataContext, cacheContext, false)
  if (existingUser) {
    throw new Error('That e-mail address is already in use')
  }
}
