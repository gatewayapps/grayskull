import { uploadFileToCloudinary } from './uploadFileToCloudinary'
import { GrayskullError } from '../../../foundation/errors/GrayskullError'

describe('uploadFileToCloudinary', () => {
	it('Should throw an error if passed falsey value for cloudinaryUrl', async () => {
		const testStream: any = undefined
		expect(uploadFileToCloudinary(testStream, '')).rejects.toThrowError(GrayskullError)
	})
})
