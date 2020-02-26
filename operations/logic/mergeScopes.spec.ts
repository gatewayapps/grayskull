import { mergeScopes } from './mergeScopes'

describe('mergeScopes', () => {
	it('Should correctly merge allowed scopes', () => {
		const result = mergeScopes(['test'], ['test2'], [], [])
		expect(result).toHaveProperty('allowed')

		expect(result.allowed).toHaveLength(2)
		expect(result.allowed[0]).toEqual('test')
		expect(result.allowed[1]).toEqual('test2')
		expect(result.denied).toHaveLength(0)
	})

	it('Should correctly merge denied scopes', () => {
		const result = mergeScopes([], [], ['test'], ['test2'])
		expect(result).toHaveProperty('allowed')

		expect(result.allowed).toHaveLength(0)
		expect(result.denied).toHaveLength(2)
		expect(result.denied[0]).toEqual('test')
		expect(result.denied[1]).toEqual('test2')
	})
	it('Should remove scopes from denied that are in new allowed', () => {
		const result = mergeScopes([], ['test'], ['test'], [])
		expect(result).toHaveProperty('allowed')

		expect(result.denied).toHaveLength(0)
		expect(result.allowed).toHaveLength(1)
		expect(result.allowed[0]).toEqual('test')
	})
	it('Should remove scopes from allowed that are in new denied', () => {
		const result = mergeScopes(['test'], [], [], ['test'])
		expect(result).toHaveProperty('allowed')

		expect(result.denied).toHaveLength(1)
		expect(result.allowed).toHaveLength(0)
		expect(result.denied[0]).toEqual('test')
	})
})
