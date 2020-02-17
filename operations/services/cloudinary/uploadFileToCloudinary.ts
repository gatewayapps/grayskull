import { v2 as cloudinary } from 'cloudinary'
import { ReadStream } from 'fs'
import { IUploadFileResponse } from '../../../foundation/types/types'
import { GrayskullErrorCode, GrayskullError } from '../../../foundation/errors/GrayskullError'

export async function uploadFileToCloudinary(
  fileStream: ReadStream,
  cloudinaryUrl: string
): Promise<IUploadFileResponse> {
  return new Promise((resolve, reject) => {
    if (!cloudinaryUrl) {
      throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'CLOUDINARY_URL environment variable is not set')
    }
    const uploader: any = cloudinary.uploader
    const outStream = uploader.upload_stream((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          url: result.secure_url,
          size: result.bytes,
          mimetype: `${result.resource_type}/${result.format}`
        })
      }
    })

    fileStream.pipe(outStream)
  })
}
