import generateSecret from './generateSecret'

describe('generateSecret', () => {
	it('should generate a random secret at the correct length', () => {
		const secret = generateSecret()

		expect(secret).not.toBeNull()
		expect(secret?.length).toEqual(64)
	})

	it('should return different secrets each time. (secret1 !== secret2)', () => {
		const secret1 = generateSecret()
		const secret2 = generateSecret()

		expect(secret1).not.toBeNull()
		expect(secret2).not.toBeNull()
		expect(secret1?.length).toEqual(64)
		expect(secret2?.length).toEqual(64)
		expect(secret1).not.toEqual(secret2)
	})
})
