const SECRET_LENGTH = 32

export default function generateSecret() {
	const array = new Uint8Array(SECRET_LENGTH)
	window.crypto.getRandomValues(array)
	return Array.prototype.map.call(array, (x) => ('00' + x.toString(16)).slice(-2)).join('')
}
