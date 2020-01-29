import { v2 as cloudinary } from 'cloudinary'
import fs, { ReadStream } from 'fs-extra'
import { FileUpload } from '../../types/FileUpload'
import path, { join } from 'path'
import uuid from 'uuid/v4'
import { IUploadFileResponse } from '../../../foundation/models/IUploadFileResponse'

const UPLOAD_DIR = join(process.env.PROJECT_ROOT!, `public/uploads/`)

class UploadService {
  public async createUpload(upload: FileUpload): Promise<IUploadFileResponse | undefined> {
    try {
      const { createReadStream, filename, mimetype } = await upload
      const stream = createReadStream()

      if (process.env.CLOUDINARY_URL) {
        //const fullLocalPath = path.join(UPLOAD_DIR, localFilename)
        return new Promise((resolve, reject) => {
          const uploader: any = cloudinary.uploader
          const outStream = uploader.upload_stream((err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve({
                url: result.secure_url,
                size: 0,
                mimetype: 'image/jpg'
              })
            }
          })

          stream.pipe(outStream)
        })
      } else {
        const { localFilename, size } = await this.writeToDisk(stream, filename)
        const url = `/uploads/${localFilename}`
        return {
          url,
          mimetype,
          size
        }
      }
    } catch (err) {
      console.error(err)
      throw err
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
