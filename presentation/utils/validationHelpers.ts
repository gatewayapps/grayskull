import validator from 'validator'

export function isUrl(url: string): boolean {
	return validator.isURL(url, { require_tld: false, require_valid_protocol: false })
}

export function isValidUrl(url: string): boolean {
	return validator.isURL(url, {
		require_tld: false,
		require_valid_protocol: false,
		require_host: false,
		allow_protocol_relative_urls: true,
		require_protocol: false
	})
}

export function isUrlOrEmpty(url: string): boolean {
	return !url || validator.isURL(url, { require_tld: false, require_valid_protocol: false })
}

export function allValidUrls(uris: string | string[]): boolean {
	if (!Array.isArray(uris) || uris.length === 0) {
		return false
	}

	const isInvalid = uris.some((uri) => !validator.isURL(uri, { require_valid_protocol: false }))
	return !isInvalid
}
