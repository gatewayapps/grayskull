import crypto, { randomBytes } from 'crypto'
import { saveStringSetting } from '../setting/saveSetting'
import Knex from 'knex'

export async function generateRSAKeyPair(dataContext: Knex) {
	const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
		modulusLength: 2048, // the length of your key in bits
		publicKeyEncoding: {
			type: 'spki', // recommended to be 'spki' by the Node.js docs
			format: 'pem'
		},
		privateKeyEncoding: {
			type: 'pkcs8', // recommended to be 'pkcs8' by the Node.js docs
			format: 'pem'
			//cipher: 'aes-256-cbc',   // *optional*
			//passphrase: 'top secret' // *optional*
		}
	})

	const keyId = randomBytes(32).toString('hex')

	await saveStringSetting('RSA_PUBLIC_KEY', publicKey, 'Security', dataContext)
	await saveStringSetting('RSA_PRIVATE_KEY', privateKey, 'Security', dataContext)
	await saveStringSetting('RSA_KEY_ID', keyId, 'Security', dataContext)

	return { privateKey, publicKey }
}
