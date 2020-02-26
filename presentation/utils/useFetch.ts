import React from 'react'
import generateFingerprint from './generateFingerprint'
import { LiteralType } from 'typescript'

export const useFetch = (url, options, triggerProps: LiteralType[] = []) => {
	const [response, setResponse] = React.useState(null)
	const [error, setError] = React.useState(null)
	const [isLoading, setIsLoading] = React.useState(true)

	// const [refetch, setRefetch] = React.useState(null)
	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		try {
			const fingerprint = await generateFingerprint()
			if (!options.headers) {
				options.headers = {}
			}
			options.headers['x-fingerprint'] = fingerprint

			const response = await fetch(url, options)
			const json = await response.json()
			setResponse(json)
			setIsLoading(false)
		} catch (error) {
			setError(error)
		}
	}, [url, options])

	React.useEffect(() => {
		refetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetch, ...triggerProps])
	return { response, error, isLoading, refetch }
}
