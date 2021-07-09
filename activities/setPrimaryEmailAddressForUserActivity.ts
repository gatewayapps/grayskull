import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getEmailAddressById } from '../operations/data/emailAddress/getEmailAddressById'
import { setPrimaryEmailAddress } from '../operations/data/emailAddress/setPrimaryEmailAddress'
import { sendTemplatedEmail } from '../operations/services/mail/sendEmailTemplate'

export async function setPrimaryEmailAddressForUserActivity(
	emailAddressId: string,
	{ dataContext, user, configuration }: IRequestContext
) {
	if (!user) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be signed in to do that')
	} else {
		const emailAddress = await getEmailAddressById(emailAddressId, dataContext)
		const emails = [emailAddress?.emailAddress, user.emailAddress]
		if (!emailAddress) {
			throw new GrayskullError(
				GrayskullErrorCode.InvalidEmailAddress,
				`No email address found with id ${emailAddressId}`
			)
		} else {
			if (emailAddress.userAccountId !== user.userAccountId) {
				throw new GrayskullError(
					GrayskullErrorCode.InvalidEmailAddress,
					`Email address ${emailAddressId} is not associated with user ${user.userAccountId}`
				)
			}
			if (!emailAddress.verified) {
				throw new GrayskullError(
					GrayskullErrorCode.InvalidEmailAddress,
					'Only verified email addresses can be set as primary'
				)
			} else {
				await setPrimaryEmailAddress(emailAddressId, user.userAccountId, dataContext)
				emails.forEach(async (email) => {
					await sendTemplatedEmail(
						`passwordEmailChangeTemplate`,
						email as string,
						'Account Information Changed',
						{
							realmName: configuration.Server.realmName,
							user: user,
							change: 'Primary Email Address'
						},
						configuration
					)
				})
			}
		}
	}
}
