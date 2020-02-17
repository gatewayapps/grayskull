jest.mock('../../../activities/uploadFile', () => ({
  uploadFile: () => true
}))
import { uploadFileResolver } from './uploadFileResolver'
import { default as uploadFileActivity } from '../../../activities/uploadFile'

describe('verifyEmailAddressResolver', () => {
  it('should call the verifyEmailAddress activity', async () => {
    const args: any = {
      file: new Promise((resolve) => {
        resolve({
          createReadStream: function() {
            return true
          },
          fileName: '',
          mimeType: ''
        })
      })
    }

    const obj: any = {}

    const resolverSpy = jest.spyOn(uploadFileActivity, 'uploadFile')

    await uploadFileResolver(obj, args)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
