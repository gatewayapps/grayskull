import { NextApiRequest, NextApiResponse } from 'next'
import { prepareRemoteContext } from '../../../foundation/context/prepareRemoteContext'
import { changePasswordWithTokenActivity } from '../../../activities/authentication/changePasswordWithTokenActivity'
import { cors, runMiddleware } from '../../../operations/middleware/cors'

export default async function changePasswordWithToken(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors)
	if (req.method !== 'POST') {
		res.status(405)
		return
	}
	try {
		const context = await prepareRemoteContext(req, res, true)
		const { emailAddress, newPassword, token } = req.query
		await changePasswordWithTokenActivity(emailAddress as string, token as string, newPassword as string, context)
		res.status(200).json({ success: true })
	} catch (err) {
		console.error(err)
		if (err instanceof Error) {
			res.status(400).json({ success: false, reason: err.message })
		} else {
			res.status(400).json({ success: false, reason: 'Unknown error' })
		}
	}
}
