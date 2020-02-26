import { uploadFileActivity } from '../../../activities/uploadFileActivity'

export async function uploadFileResolver(obj, args) {
	const { createReadStream, filename, mimetype } = await args.file
	const fileStream = createReadStream()
	return await uploadFileActivity(fileStream, filename, mimetype)
}
