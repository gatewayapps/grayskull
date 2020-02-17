import { uploadFile } from '../../../activities/uploadFile'

export async function uploadFileResolver(obj, args) {
  const { createReadStream, filename, mimetype } = await args.file
  const fileStream = createReadStream()
  return await uploadFile(fileStream, filename, mimetype)
}
