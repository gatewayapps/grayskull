import { IUserAccount } from '../foundation/types/types'
import { IRequestContext } from '../foundation/context/prepareContext'
import { createUserAccount } from '../operations/data/userAccount/createUserAccount'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'
import { isEmailAddressAvailable } from '../operations/data/emailAddress/isEmailAddressAvailable'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { createEmailAddress } from '../operations/data/emailAddress/createEmailAddress'
import { generateUserAccountActivationToken } from '../operations/data/userAccount/generateUserAccountActivationToken'
import { sendTemplatedEmail } from '../operations/services/mail/sendEmailTemplate'

/**
 * 1. Make sure the user is an admin
 * 2. Verify the email address is not taken
 * 3. Create the user account
 * 4. Create the email address record
 * 5. Create an activation token and cache it for 2 hours
 * 6. Send activation link

 * @param userAccountDetails 
 * @param emailAddress 
 * @param context 
 */
export async function createUserAccountActivity(
	userAccountDetails: IUserAccount,
	emailAddress: string,
	context: IRequestContext
) {
	ensureAdministrator(context)
	if (!(await isEmailAddressAvailable(emailAddress, context.dataContext))) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidEmailAddress,
			`That email address, ${emailAddress}, is already in use`
		)
	}
	const userAccount = await createUserAccount(userAccountDetails, undefined, context.dataContext, context.user)
	await createEmailAddress(emailAddress, userAccount.userAccountId, context.dataContext, true, false)

	const activationToken = await generateUserAccountActivationToken(emailAddress, context.dataContext)
	const activateLink = new URL(
		`activate?emailAddress=${emailAddress}&token=${activationToken}`,
		context.configuration.Server.baseUrl!
	).href
	await sendTemplatedEmail(
		'activateAccountTemplate',
		emailAddress,
		`Activate Your ${context.configuration.Server.realmName} Account`,
		{
			activateLink,
			realmName: context.configuration.Server.realmName,
			user: userAccount,
			createdBy: context.user
		},
		context.configuration
	)
}
