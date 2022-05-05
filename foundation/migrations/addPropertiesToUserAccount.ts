import Knex from 'knex'

export async function up(knex: Knex) {
	await knex.schema.table('UserAccounts', (table) => {
		table.string('properties', 2048).defaultTo(JSON.stringify({})).notNullable
	})

	await knex.raw('UPDATE UserAccounts SET properties=?', JSON.stringify({}))
}

export async function down(knex: Knex) {
	await knex.schema.table('UserAccounts', (table) => {
		table.dropColumn('properties')
	})
}

export const addPropertiesToUserAccount = {
	name: 'addPropertiesToUserAccount',
	up,
	down
}
