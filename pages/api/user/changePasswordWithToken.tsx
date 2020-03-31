import { NextApiRequest, NextApiResponse } from 'next'
import { prepareRemoteContext } from '../../../foundation/context/prepareRemoteContext'
import { changePasswordWithTokenActivity } from '../../../activities/authentication/changePasswordWithTokenActivity'

export default async function changePasswordWithToken(req: NextApiRequest, res: NextApiResponse) {
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
		res.status(400).json({ success: false, message: err.message })
	}
}
