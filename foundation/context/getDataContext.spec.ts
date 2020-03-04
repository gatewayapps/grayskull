import Knex from 'knex'
import { getDataContext } from './getDataContext'

export async function getInMemoryContext() {
	const options: Knex.Config = {
		log: undefined,
		client: 'sqlite',
		connection: {
			database: 'grayskull',
			filename: ':memory:'
		}
	}

	const context = await getDataContext(options)
	await context.migrate.up({ directory: './foundation/migrations' })
	return context
}

describe('getDataContext', () => {
	it('should correctly return a data context', async () => {
		const dc = await getInMemoryContext()

		expect(dc).toBeDefined()
	})
})
