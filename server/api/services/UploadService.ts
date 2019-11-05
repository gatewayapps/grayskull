import { getCurrentConfiguration } from '../../config/ConfigurationManager'
import { CONFIG_DIR } from '../../constants'
import fs, { ReadStream } from 'fs-extra'
import { FileUpload } from '../../types/FileUpload'
import path from 'path'
import uuid from 'uuid/v4'
import { IUploadFileResponse } from '../../data/models/IUploadFileResponse'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

const UPLOAD_PATH = 'uploads'
const UPLOAD_DIR = `${serverRuntimeConfig.PROJECT_ROOT}/public/${UPLOAD_PATH}`

class UploadService {
  public async createUpload(upload: FileUpload): Promise<IUploadFileResponse> {
    const config = await getCurrentConfiguration()
    const { createReadStream, filename, mimetype } = await upload
    const stream = createReadStream()
    const { localFilename, size } = await this.writeToDisk(stream, filename)
    const url = `/${UPLOAD_PATH}/${localFilename}`
    return {
      url,
      mimetype,
      size
    }
  }

  private writeToDisk(stream: ReadStream, filename: string): Promise<{ localFilename: string; size: number }> {
    const fileId = uuid().replace(/-/g, '')
    const extname = path.extname(filename)
    const localFilename = `${fileId}${extname}`
    const fullLocalPath = path.join(UPLOAD_DIR, localFilename)
    return new Promise((resolve, reject) => {
      fs.ensureDirSync(UPLOAD_DIR)

      stream
        .on('error', (error) => reject(error))
        .pipe(fs.createWriteStream(fullLocalPath))
        .on('finish', () => {
          fs.stat(fullLocalPath, (err2, stats) => {
            if (err2) {
              return reject(err2)
            }

            return resolve({
              localFilename,
              size: stats.size
            })
          })
        })
    })
  }
}

export default new UploadService()
