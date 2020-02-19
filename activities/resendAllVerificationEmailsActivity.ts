import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'
import { getUnverifiedPrimaryEmailAddresses } from '../operations/data/emailAddress/getUnverifiedPrimaryEmailAddresses'
import { sendEmailVerificationActivity } from './sendEmailVerificationActivity'

export async function resendAllVerificationEmailsActivity(context: IRequestContext) {
  ensureAdministrator(context)
  const emailRecords = await getUnverifiedPrimaryEmailAddresses(context.dataContext)
  await Promise.all(
    emailRecords.map(async (e) => {
      await sendEmailVerificationActivity(e.emailAddress, context)
    })
  )
}
