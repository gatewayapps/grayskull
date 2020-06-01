import { NextApiResponse, NextApiRequest } from 'next'
import { prepareRemoteContext } from '../../../../../foundation/context/prepareRemoteContext'
import { getUserClientMetadataActivity } from '../../../../../activities/clientOnly/getUserClientMetadataActivity'
import { setUserClientMetadataActivity } from '../../../../../activities/clientOnly/setUserClientMetadataActivity'

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
	try {
		const context = await prepareRemoteContext(req, res)
		if (context.accessTokenType !== 'client') {
			res.status(403).json({ success: false, message: 'Invalid access token type' })
			return
		}

		const userClientId = req.query['userClientId'].toString()

		switch (req.method) {
			case 'GET': {
				const metadataRecords = await getUserClientMetadataActivity(userClientId, context)
				res.json({ metadataRecords })
				return
			}
			case 'POST': {
				const key = req.body.key
				const value = req.body.value

				await setUserClientMetadataActivity(userClientId, key, value, context)
				res.json({ success: true })
				return
			}
			case 'DELETE': {
				const key = req.body.key
				await setUserClientMetadataActivity(userClientId, key, '', context)
				res.json({ success: true })
			}
			default: {
				res.status(405).json({ success: false, message: 'Method not valid' })
				return
			}
		}
	} catch (err) {
		console.error(err)
		res.status(403).json({ success: false, message: err.message })
	}
}
