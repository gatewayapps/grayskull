import { ReadStream } from 'fs'
import { uploadFileToCloudinary } from '../operations/services/cloudinary/uploadFileToCloudinary'
import { saveFileToDisk } from '../operations/services/disk/saveFileToDisk'

export async function uploadFileActivity(fileStream: ReadStream, fileName: string, mimeType: string) {
  if (process.env.CLOUDINARY_URL) {
    return await uploadFileToCloudinary(fileStream, process.env.CLOUDINARY_URL)
  } else {
    return await saveFileToDisk(fileStream, fileName, mimeType, process.env.PROJECT_ROOT)
  }
}
