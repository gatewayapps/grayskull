import { ISecurityConfiguration } from '../../foundation/types/types'
import { isEmailAddressDomainAllowed } from './isEmailAddressDomainAllowed'

describe('isEmailAddressDomainAllowed', () => {
	const securityConfig: Partial<ISecurityConfiguration> = {
		domainWhitelist: 'gatewayapps.com;GATEWAYENGINEERING.us;gatewaysightsound.com;yahoo.com;gmail.com;'
	}

	it('should return true if the email address domain is allowed', () => {
		const email = 'dwight.k.shrute@gatewayengineering.us'

		const allowed = isEmailAddressDomainAllowed(email, securityConfig)
		expect(allowed).toEqual(true)
	})

	it('should return false if the email address domain is not listed in the config whitelist', () => {
		const email = 'jim.halpert@toysrus.com'

		const allowed = isEmailAddressDomainAllowed(email, securityConfig)
		expect(allowed).toEqual(false)
	})

	it('should return true if all the supplied email address domains are allowed', () => {
		const emails = [
			'michael.scott@gatewayengineering.us',
			'michael.skarn@gatewayapps.com',
			'ryan.howard@GMAIL.COM',
			'todd.packer@yahoo.com'
		]

		const allEmailsAllowed = emails
			.map((email) => isEmailAddressDomainAllowed(email, securityConfig))
			.every((testResult) => testResult)

		expect(allEmailsAllowed).toEqual(true)
	})

	it('should return false if any one of the supplied email address domains are not allowed', () => {
		const emails = [
			'michael.scott@gatewayengineering.us',
			'michael.skarn@gatewayapps.com',
			'ryan.howard@sabre.com',
			'todd.packer@yahoo.com'
		]

		const allEmailsAllowed = emails
			.map((email) => isEmailAddressDomainAllowed(email, securityConfig))
			.every((testResult) => testResult)

		expect(allEmailsAllowed).toEqual(false)
	})
})
