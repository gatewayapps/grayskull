import { prepareContext } from '../../../foundation/context/prepareContext'
import { getRSAPublicKey } from '../../../operations/data/configuration/getRSAPublicKey'
import { getRSAKeyId } from '../../../operations/data/configuration/getRSAKeyId'
import { generateRSAKeyPair } from '../../../operations/data/configuration/generateRSAKeyPair'
import keyto from '@trust/keyto'
import { NextApiRequest, NextApiResponse } from 'next'
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const context = await prepareContext(req, res)
	let publicKey = await getRSAPublicKey(context.dataContext)
	let keyId = await getRSAKeyId(context.dataContext)
	if (!publicKey || !keyId) {
		await generateRSAKeyPair(context.dataContext)
		publicKey = await getRSAPublicKey(context.dataContext)
		keyId = await getRSAKeyId(context.dataContext)
	}

	const jwk = keyto.from(publicKey, 'pem').toJwk('public')
	jwk.kid = keyId
	res.json({ keys: [jwk] })
}
