const SECRET_LENGTH = 32

export default function generateSecret(): string | null {
	if (typeof window === 'undefined') return null
	const secret: string[] = []
	const array = new Uint8Array(SECRET_LENGTH)
	window.crypto.getRandomValues(array)

	array.forEach((x) => {
		secret.push(('00' + x.toString(16)).slice(-2))
	})

	return secret.join('')
}
