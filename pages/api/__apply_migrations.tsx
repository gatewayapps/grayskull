import { getDataContextFromConnectionString } from '../../foundation/context/getDataContext'
import { applyMigrations } from '../../operations/data/migrations/applyMigrations'
export default async (req, res) => {
	if (req.method === 'POST') {
		try {
			const dataContext = await getDataContextFromConnectionString(process.env.GRAYSKULL_DB_CONNECTION_STRING!)
			await applyMigrations(dataContext)
			res.json({ success: true })
		} catch (err) {
			if (err instanceof Error) {
				res.json({ success: false, reason: err.message })
			} else {
				res.json({ success: false, reason: 'Unknown error' })
			}
		}
	} else {
		res.json({ success: false, reason: 'Invalid method' })
	}
}
