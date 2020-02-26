jest.mock('../../../activities/uploadFileActivity', () => ({
  uploadFileActivity: () => true
}))
import { uploadFileResolver } from './uploadFileResolver'

const uploadFileActivity = require('../../../activities/uploadFileActivity')

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
    const resolverSpy = jest.spyOn(uploadFileActivity, 'uploadFileActivity')
    await uploadFileResolver(obj, args)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
