import Knex from 'knex'

export async function up(knex: Knex) {
	await knex.schema.table('Clients', (table) => {
		table.string('TokenSigningMethod', 1024).defaultTo('HS256').notNullable
	})

	await knex.raw('UPDATE Clients SET TokenSigningMethod=?', 'HS256')
}

export async function down(knex: Knex) {
	await knex.schema.table('Clients', (table) => {
		table.dropColumn('TokenSigningMethod')
	})
}

export const addTokenSigningMethodToClient = {
	name: 'addTokenSigningMethodToClient',
	up,
	down
}
