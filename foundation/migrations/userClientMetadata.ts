import Knex from 'knex'

export async function up(knex: Knex) {
	await knex.schema.createTable('UserClientMetadata', (table) => {
		table.string('userClientId').notNullable()
		table.string('key', 50).notNullable()
		table.string('value', 500).notNullable()

		table.primary(['userClientId', 'key'])
	})
}

export async function down(knex: Knex) {
	await knex.schema.dropTable('UserClientMetadata')
}

export const userClientMetadata = {
	name: 'userClientMetadata',
	up,
	down
}
