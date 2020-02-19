import { DataContext } from '../../../foundation/context/getDataContext'

export async function setUserAccountOTPSecret(
  userAccountId: string,
  otpSecret: string,
  otpEnabled: boolean,
  context: DataContext
) {
  return await context.UserAccount.update(
    {
      otpSecret,
      otpEnabled
    },
    {
      where: {
        userAccountId
      },
      validate: false
    }
  )
}
