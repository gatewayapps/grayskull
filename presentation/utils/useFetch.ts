import React, { useEffect } from 'react'

export const useFetch = (url, options) => {
	const [response, setResponse] = React.useState(null)
	const [error, setError] = React.useState<Error>()
	const [isLoading, setIsLoading] = React.useState(true)

	const makeRequest = async () => {
		setIsLoading(true)
		try {
			const response = await fetch(url, options)
			const json = await response.json()
			setResponse(json)
			setIsLoading(false)
		} catch (error) {
			if (error instanceof Error) {
				setError(error)
			}
		}
	}

	useEffect(() => {
		makeRequest()
	}, [url, options])

	return { response, error, isLoading }
}
