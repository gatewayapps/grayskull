import { ReadStream } from 'fs'
import fs from 'fs-extra'
import uuid from 'uuid'
import path from 'path'
import { IUploadFileResponse } from '../../../foundation/types/types'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

export async function saveFileToDisk(
  fileStream: ReadStream,
  fileName: string,
  mimeType: string,
  localDirectory: string
): Promise<IUploadFileResponse> {
  if (!localDirectory) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidRuntimeEnvironment,
      `Attempted to write file to disk in serverless environment.`
    )
  }

  const fileId = uuid().replace(/-/g, '')
  const extname = path.extname(fileName)
  const localFilename = `${fileId}${extname}`
  const uploadDirectory = path.join(localDirectory, 'public/uploads/')
  const fullLocalPath = path.join(uploadDirectory, localFilename)
  return new Promise((resolve, reject) => {
    try {
      fs.ensureDirSync(uploadDirectory)
      fileStream
        .on('error', (error) => reject(error))
        .pipe(fs.createWriteStream(fullLocalPath))
        .on('finish', () => {
          fs.stat(fullLocalPath, (err2, stats) => {
            if (err2) {
              reject(err2)
              return
            }
            resolve({
              url: `/uploads/${localFilename}`,
              size: stats.size,
              mimetype: mimeType
            })
          })
        })
    } catch (err) {
      reject(err)
    }
  })
}
