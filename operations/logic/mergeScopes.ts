import _ from 'lodash'

export function mergeScopes(oldAllowed: string[], newAllowed: string[], oldDenied: string[], newDenied: string[]) {
	const newDeniedScopes = _.uniq(oldDenied.concat(newDenied)).filter((denied) => !newAllowed.includes(denied))
	const newAllowedScopes = _.uniq(oldAllowed.concat(newAllowed)).filter((allowed) => !newDeniedScopes.includes(allowed))
	return {
		allowed: newAllowedScopes,
		denied: newDeniedScopes
	}
}
