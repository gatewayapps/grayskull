import { ReadStream } from 'fs'
import fs from 'fs-extra'
import uuid from 'uuid'
import path from 'path'
import { IUploadFileResponse } from '../../../foundation/types/types'
const UPLOAD_DIR = path.join(process.env.PROJECT_ROOT!, `public/uploads/`)

export async function saveFileToDisk(
  fileStream: ReadStream,
  fileName: string,
  mimeType: string
): Promise<IUploadFileResponse> {
  const fileId = uuid().replace(/-/g, '')
  const extname = path.extname(fileName)
  const localFilename = `${fileId}${extname}`
  const fullLocalPath = path.join(UPLOAD_DIR, localFilename)
  return new Promise((resolve, reject) => {
    try {
      fs.ensureDirSync(UPLOAD_DIR)
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
