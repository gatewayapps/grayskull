import { NextApiResponse, NextApiRequest } from 'next'
import { prepareRemoteContext } from '../../../../foundation/context/prepareRemoteContext'
import { listAuthorizedUsersActivity } from '../../../../activities/clientOnly/listAuthorizedUsersActivity'
async function listAuthorizedUsers(req: NextApiRequest, res: NextApiResponse) {
	try {
		const context = await prepareRemoteContext(req, res)
		if (context.accessTokenType !== 'client') {
			res.status(403)
			return
		}
		const result = await listAuthorizedUsersActivity(req.query['client_id'].toString(), 100, 0, context)
		res.json(result)
	} catch (err) {
		console.error(err)
		res.status(403)
	}
}

export default listAuthorizedUsers
