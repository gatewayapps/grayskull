import { maskStringSegment } from './maskStringSegment'

describe('maskStringSegment', () => {
	it('should mask the rest of the string if no length is provided', () => {
		expect(maskStringSegment('test', 2)).toEqual('te**')
	})
	it('should only replace non whitespace characters', () => {
		expect(maskStringSegment('test string', 2)).toEqual('te** ******')
	})
	it('Should only mask the middle section of a string if a length is provided', () => {
		expect(maskStringSegment('test', 1, 2)).toEqual('t**t')
	})
	it('Should correctly mask a phone number', () => {
		expect(maskStringSegment('+1 123-456-7890', 3, 7)).toEqual('+1 ***-***-7890')
	})
})
