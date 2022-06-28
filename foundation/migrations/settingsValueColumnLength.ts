import Knex from 'knex'

export async function up(knex: Knex) {
	await knex.schema.table('Settings', (table) => {
		if (knex.client && knex.client.config && knex.client.config.client === 'sqlite') {
			return
		}
		table
			.string('value', 2048)
			.nullable()
			.alter()
	})
}

export async function down(knex: Knex) {
	if (knex.client && knex.client.config && knex.client.config.client === 'sqlite') {
		return
	}
	await knex.schema.table('Settings', (table) => {
		table
			.string('value', 255)
			.nullable()
			.alter()
	})
}

export const settingsValueColumnLength = {
	name: 'settingsValueColumnLength',
	up,
	down
}
