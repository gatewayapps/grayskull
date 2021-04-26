import { NextApiResponse, NextApiRequest } from 'next'
import { prepareRemoteContext } from '../../../../foundation/context/prepareRemoteContext'
import { listAuthorizedUsersActivity } from '../../../../activities/clientOnly/listAuthorizedUsersActivity'
import { cors, runMiddleware } from '../../../../operations/middleware/cors'
async function listAuthorizedUsers(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors)
	try {
		const context = await prepareRemoteContext(req, res)
		if (context.accessTokenType !== 'client') {
			res.status(403)
			return
		}

		const limit = req.query['limit'] !== undefined ? parseInt(req.query['limit'].toString()) : 100
		const offset = req.query['offset'] !== undefined ? parseInt(req.query['offset'].toString()) : 0

		const result = await listAuthorizedUsersActivity(req.query['client_id'].toString(), limit, offset, context)
		res.json(result)
	} catch (err) {
		console.error(err)
		res.status(403)
	}
}

export default listAuthorizedUsers
