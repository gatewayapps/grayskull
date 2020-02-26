import { createHmac } from 'crypto'

export function hashValue(value: string, secret: string) {
	return createHmac('sha256', secret)
		.update(value)
		.digest('hex')
}
