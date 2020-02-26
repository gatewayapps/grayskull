import { saveFileToDisk } from './saveFileToDisk'
import { GrayskullError } from '../../../foundation/errors/GrayskullError'

describe('saveFileToDisk', () => {
	it('Should throw an error if passed falsey value for project root path', async () => {
		const testStream: any = undefined
		expect(saveFileToDisk(testStream, 'test.txt', 'test/txt', '')).rejects.toThrowError(GrayskullError)
	})
})
