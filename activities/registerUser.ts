import { IUserAccount } from '../foundation/types/types'
import { IRequestContext } from '../foundation/context/prepareContext'
import { isEmailAddressDomainAllowed } from '../operations/logic/isEmailAddressDomainAllowed'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getEmailAddressByEmailAddress } from '../operations/data/emailAddress/getEmailAddressByEmailAddress'
import { Permissions } from '../foundation/constants/permissions'
import { createUserAccount } from '../operations/data/userAccount/createUserAccount'
import { verifyPasswordStrength } from '../operations/logic/verifyPasswordStrength'
import { createEmailAddress } from '../operations/data/emailAddress/createEmailAddress'
import { sendEmailVerification } from './sendEmailVerification'
import { createSession } from '../operations/data/session/createSession'

/*
    1.  Is the email address allowed
    2.  Is the email address already taken
    3.  If this is the first user, make them an admin
    4.  Create the user account
    5.  Create the email address, if this is first user, verify it
    6.  Send verification email
*/

export async function registerUser(
  data: IUserAccount,
  emailAddress: string,
  password: string,
  context: IRequestContext
) {
  const { configuration, dataContext } = context
  if (!isEmailAddressDomainAllowed(emailAddress, configuration.Security)) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailAddress,
      `${emailAddress} is not valid for self registration`
    )
  }

  const existingEmail = await getEmailAddressByEmailAddress(emailAddress, dataContext)
  if (existingEmail) {
    throw new GrayskullError(GrayskullErrorCode.InvalidEmailAddress, `${emailAddress} has already been registered`)
  }

  const userCount = await dataContext.UserAccount.count()
  if (userCount === 0) {
    data.permissions = Permissions.Admin
  } else {
    data.permissions = Permissions.User
  }

  data.otpEnabled = data.otpEnabled || false
  data.otpSecret = data.otpSecret || null
  data.isActive = true

  const passwordVerification = verifyPasswordStrength(password, configuration.Security)
  if (!passwordVerification.success) {
    throw new GrayskullError(
      GrayskullErrorCode.PasswordFailsSecurityRequirements,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      passwordVerification.validationErrors!.join(';')
    )
  }

  const userAccount = await createUserAccount(data, password, dataContext)
  await createEmailAddress(emailAddress, userAccount.userAccountId, dataContext, true, userCount === 0)
  if (userCount > 0) {
    await sendEmailVerification(emailAddress, context)
  }

  const fingerprint = context.req.headers['x-fingerprint'].toString()
  if (fingerprint) {
    await createSession(
      {
        fingerprint,
        userAccountId: userAccount.userAccountId,
        ipAddress: context.req.socket.remoteAddress
      },
      false,
      context.dataContext
    )

    // setAuthCookies(context.res, session)
  }

  return userAccount
}
