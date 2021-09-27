import btoa from 'btoa'
import atob from 'atob'
export function generateRoutingState({ pathname, query }) {
	return btoa(
		JSON.stringify({
			pathname,
			query
		})
	)
}

export function parseRoutingState(state) {
	return JSON.parse(atob(state))
}

export function parseQueryParams(query) {
	if (typeof query === 'string') return query

	const queryLength = Object.keys(query).length
	let current = 1
	let queryString = ''
	for (const param of Object.keys(query)) {
		if (param === 'scope') {
			queryString += `${param}=${encodeURIComponent(query[param])}${current < queryLength ? '&' : ''}`
		} else {
			queryString += `${param}=${query[param]}${current < queryLength ? '&' : ''}`
		}
		current++
	}
	return queryString
}
