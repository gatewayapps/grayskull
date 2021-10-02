const SECRET_LENGTH = 32

export default function generateSecret(): string {
	const array = new Uint8Array(SECRET_LENGTH)
	window.crypto.getRandomValues(array)
	return array.map((x) => parseInt(('00' + x.toString(16)).slice(-2))).join('')
}
