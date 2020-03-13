import Knex from 'knex'

export async function up(knex: Knex) {
	await knex.schema.table('Clients', (table) => {
		table.string('AuthorizationFlows', 1024).nullable()
	})

	const existingAuthorizationFlows = JSON.stringify(['authorization_code', 'refresh_token'])
	await knex.raw('UPDATE Clients SET AuthorizationFlows=?', [existingAuthorizationFlows])
}

export async function down(knex: Knex) {
	await knex.schema.table('Clients', (table) => {
		table.dropColumn('AuthorizarionFlows')
	})
}

export const addClientAuthorizationFlowTypes = {
	name: 'addClientAuthorizationFlowTypes',
	up,
	down
}
