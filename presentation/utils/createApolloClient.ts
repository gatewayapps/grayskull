import fetch from 'isomorphic-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink, Observable } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'

export default function createApolloClient() {
	const onErrorHandler = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors) {
			graphQLErrors.forEach((err) => {
				console.error(err)

				if (err.extensions && err.extensions.code === 'UNAUTHENTICATED' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
					window.location.replace('/login')
				}
				if (err.extensions && err.extensions.code === 'FORBIDDEN' && window.location.pathname !== '/oobe') {
					window.location.replace('/oobe')
					return
				}
			})

			graphQLErrors.map(({ message, locations, path }) => {
				console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
			})
		}
		if (networkError) {
			console.error(`[Network error]: ${networkError}`)
		}
	})

	const requestLink = new ApolloLink(
		(operation, forward) =>
			new Observable((observer) => {
				let handle: any
				Promise.resolve(operation)
					.then(() => {
						handle = forward(operation).subscribe({
							next: observer.next.bind(observer),
							error: observer.error.bind(observer),
							complete: observer.complete.bind(observer)
						})
					})
					.catch(observer.error.bind(observer))

				return () => {
					if (handle) {
						handle.unsubscribe()
					}
				}
			})
	)

	const uploadLink = createUploadLink({
		uri: '/api/graphql',
		fetch: fetch
	})

	return new ApolloClient({
		cache: new InMemoryCache(),
		link: ApolloLink.from([onErrorHandler, requestLink, uploadLink])
	})
}
