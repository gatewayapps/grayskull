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
