export function getCacheKeyForUserAccountActivation(emailAddress: string) {
	const finalEmailAddress = decodeURIComponent(emailAddress)
		.toLowerCase()
		.trim()

	return `ACTIVATION:${finalEmailAddress}`
}
