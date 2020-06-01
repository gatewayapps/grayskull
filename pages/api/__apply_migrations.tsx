import { getDataContextFromConnectionString } from '../../foundation/context/getDataContext'
import { applyMigrations } from '../../operations/data/migrations/applyMigrations'
export default async (req, res) => {
	try {
		const dataContext = await getDataContextFromConnectionString(process.env.GRAYSKULL_DB_CONNECTION_STRING!)
		await applyMigrations(dataContext)
		res.json({ success: true })
	} catch (err) {
		res.json({ success: false, reason: err.message })
	}
}
