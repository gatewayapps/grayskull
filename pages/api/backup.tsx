import { NextApiRequest, NextApiResponse } from 'next'
import { prepareContext } from '../../foundation/context/prepareContext'
import { backupConfigurationActivity } from '../../activities/backupConfigurationActivity'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const context = await prepareContext(req, res)
	if (!req.query.code) {
		res.status(404)
		return
	} else {
		const code = req.query.code.toString()
		try {
			const encryptedBackup = await backupConfigurationActivity(code, context)
			res.status(200)
			res.setHeader('Content-Disposition', 'attachment; filename="backup.gsb"')
			res.setHeader('Content-Type', 'application/octet-stream; charset=utf-8')
			res.send(encryptedBackup)
		} catch (err) {
			console.error(err)
			res.status(403)
			return
		}
	}
}
