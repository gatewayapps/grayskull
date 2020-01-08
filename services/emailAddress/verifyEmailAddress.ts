import { DataContext } from '../../context/getDataContext'

export async function verifyEmailAddress(emailAddress: string, verificationSecret: string, dataContext: DataContext) {
  const emailRecord = await dataContext.EmailAddress.findOne({
    where: {
      emailAddress,
      verificationSecret
    }
  })

  if (!emailRecord) {
    throw new Error('Invalid e-mail address or verification secret')
  }

  if (emailRecord.verified) {
    throw new Error('E-mail address is already verified')
  }

  emailRecord.verified = true
  emailRecord.updatedAt = new Date()
  await emailRecord.save()

  return emailRecord
}
