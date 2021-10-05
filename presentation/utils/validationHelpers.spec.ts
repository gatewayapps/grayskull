import * as validationHelpers from './validationHelpers'

describe('validationHelpers', () => {
	it('should return true if the argument is a url', () => {
		const url = 'https://test-url.com'
		const isValidUrl = validationHelpers.isUrl(url)

		expect(isValidUrl).toEqual(true)
	})
	it('should return false if the argument is not a url', () => {
		const url = 'http:// fake-url'
		const isValidUrl = validationHelpers.isUrl(url)

		expect(isValidUrl).toEqual(false)
	})

	it('should return true if the argument is a valid url', () => {
		const url = 'https://test-url.com'
		const isValidUrl = validationHelpers.isValidUrl(url)

		expect(isValidUrl).toEqual(true)
	})
	it('should return false if the argument is not a valid url', () => {
		const url = 'http:// fake-url'
		const isValidUrl = validationHelpers.isValidUrl(url)

		expect(isValidUrl).toEqual(false)
	})

	it('should return true if the url is valid and not empty', () => {
		const url = 'https://test-url.com'
		const isValidUrl = validationHelpers.isUrlOrEmpty(url)

		expect(isValidUrl).toEqual(true)
	})
	it('should return true if the url is empty', () => {
		const url = ''
		const isValidUrl = validationHelpers.isUrlOrEmpty(url)

		expect(isValidUrl).toEqual(true)
	})
	it('should return false if the url is not empty but is invalid', () => {
		const url = 'http:// fake-url'
		const isValidUrl = validationHelpers.isUrlOrEmpty(url)

		expect(isValidUrl).toEqual(false)
	})

	it('should return true if all the urls are valid', () => {
		const urls = ['https://test-1.com', 'https://test-2.com', 'https://test-3.com', 'https://test-4.com']
		const allUrlsValid = validationHelpers.allValidUrls(urls)

		expect(allUrlsValid).toEqual(true)
	})
	it('should return false if any url is invalid', () => {
		const urls = ['https://test-1.com', 'https://test-2.com', 'test-3', 'https://test-4.com']
		const allUrlsValid = validationHelpers.allValidUrls(urls)

		expect(allUrlsValid).toEqual(false)
	})
	it('should return false if the argument is an empty string or an empty array', () => {
		const urls = ''
		const emptyUrls = []
		const allUrlsValid = validationHelpers.allValidUrls(urls)
		const emptyUrlisValid = validationHelpers.allValidUrls(emptyUrls)

		expect(allUrlsValid).toEqual(false)
		expect(emptyUrlisValid).toEqual(false)
	})
})
