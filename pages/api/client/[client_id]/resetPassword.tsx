import { NextApiRequest, NextApiResponse } from 'next'
import { prepareRemoteContext } from '../../../../foundation/context/prepareRemoteContext'
import { sendResetPasswordEmailFromClientActivity } from '../../../../activities/authentication/sendResetPasswordEmailFromClientActivity'
import { cors, runMiddleware } from '../../../../operations/middleware/cors'

export default async function resetPassword(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors)
	if (req.method !== 'POST') {
		res.status(405)
		return
	}
	try {
		const context = await prepareRemoteContext(req, res, true)
		const { emailAddress, redirectUri, client_id } = req.query
		await sendResetPasswordEmailFromClientActivity(
			emailAddress as string,
			client_id as string,
			redirectUri as string,
			context
		)
	} catch (err) {
		console.error(err)
	} finally {
		res.status(200).json({ success: true })
	}
}
