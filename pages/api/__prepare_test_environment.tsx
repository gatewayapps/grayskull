import { NextApiResponse } from 'next'
import { prepareDatabaseForTests } from '../../tests/prepareDatabaseForTests'

export default async function prepareTestEnvironment(req, res: NextApiResponse) {
	if (!process.env.ENABLE_TEST_ENDPOINTS) {
		res.status(400).end()
	}
	try {
		await prepareDatabaseForTests()
		res.status(200).json({ success: true })
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({ success: false, message: err.message, location: err.stack })
		} else {
			res.status(400).json({ success: false, reason: 'Unknown error' })
		}
	}
}
