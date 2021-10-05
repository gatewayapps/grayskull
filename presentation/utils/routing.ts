import btoa from 'btoa'
import atob from 'atob'
import { NextRouter } from 'next/router'

interface QueryParams {
	[key: string]: string | number | boolean
}

type Query = string | QueryParams

export function generateRoutingState({ pathname, query }: NextRouter): string {
	return btoa(
		JSON.stringify({
			pathname,
			query
		})
	)
}

export function parseRoutingState<T>(state: string): T {
	return JSON.parse(atob(state))
}

export function parseQueryParams(query: Query): string {
	if (typeof query === 'string') return query

	const queryLength = Object.keys(query).length
	let current = 1
	let queryString = ''

	for (const param of Object.keys(query)) {
		const querySeparator = current < queryLength ? '&' : ''
		const isScope = param === 'scope'

		queryString += `${param}=${isScope ? encodeURIComponent(query[param]) : query[param]}${querySeparator}`
		current++
	}

	return queryString
}
