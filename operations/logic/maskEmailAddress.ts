import { maskStringSegment } from './maskStringSegment'

export function maskEmailAddress(emailAddress: string) {
	const parts = emailAddress.split('@')
	return `${maskStringSegment(parts[0], parts[0].length / 2)}@${maskStringSegment(parts[1], parts[1].length / 2)}`
}
