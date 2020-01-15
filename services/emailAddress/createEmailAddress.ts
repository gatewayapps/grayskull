import { DataContext } from '../../context/getDataContext'
import { randomBytes } from 'crypto'

export async function createEmailAddress(
  emailAddress: string,
  userAccountId: string,
  dataContext: DataContext,
  primary,
  verified
) {
  return new dataContext.EmailAddress({
    emailAddress,
    userAccountId: userAccountId,
    verified,
    primary,
    createdAt: new Date(),
    updatedAt: new Date(),
    verificationSecret: verified ? '' : randomBytes(16).toString('hex')
  }).save()
}
