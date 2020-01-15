import { DataContext } from '../../context/getDataContext'
import { InvalidOperationError } from './errors'

export async function verifyEmailAddress(emailAddress: string, verificationSecret: string, dataContext: DataContext) {
  const emailRecord = await dataContext.EmailAddress.findOne({
    where: {
      emailAddress,
      verificationSecret
    }
  })

  if (!emailRecord) {
    throw new InvalidOperationError('Invalid e-mail address or verification secret', 'E_UNKNOWN_ADDRESS')
  } else {
    if (emailRecord.verified) {
      throw new InvalidOperationError('E-mail address is already verified', 'E_ADDRESS_VERIFIED')
    } else {
      emailRecord.verified = true
      emailRecord.updatedAt = new Date()
      await emailRecord.save()

      return emailRecord
    }
  }
}
