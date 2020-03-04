import Knex from 'knex'
export async function up(knex: Knex) {
	return knex.schema
		.createTable('UserAccounts', (table) => {
			table
				.uuid('userAccountId')
				.primary()
				.unique()
				.notNullable()
			table.string('firstName').notNullable()
			table.string('lastName').notNullable()
			table.string('displayName').nullable()
			table.dateTime('lastActive').notNullable()
			table.dateTime('lastPasswordChange').notNullable()
			table.string('passwordHash').notNullable()
			table.string('gender').nullable()
			table.dateTime('birthday').nullable()
			table.string('profileImageUrl').nullable()
			table.integer('permissions').notNullable()
			table.string('otpSecret').nullable()
			table.boolean('otpEnabled').notNullable()
			table.boolean('isActive').notNullable()
			table.string('createdBy').nullable()
			table.dateTime('createdAt').notNullable()
			table.string('updatedBy').nullable()
			table.dateTime('updatedAt').notNullable()
			table.string('deletedBy').nullable()
			table.dateTime('deletedAt').nullable()
		})
		.createTable('Sessions', async (table) => {
			table
				.uuid('sessionId')
				.notNullable()
				.primary()
			table.string('userAccountId').notNullable()
			table.string('name').nullable()
			table.string('ipAddress').notNullable()
			table.dateTime('expiresAt').notNullable()
			table.string('createdBy').nullable()
			table.dateTime('createdAt').notNullable()
			table.string('updatedBy').nullable()
			table.dateTime('updatedAt').notNullable()
		})
		.createTable('EmailAddresses', (table) => {
			table
				.uuid('emailAddressId')
				.notNullable()
				.primary()
			table.string('userAccountId').notNullable()
			table
				.string('emailAddress')
				.notNullable()
				.unique()
			table.boolean('verified').notNullable()
			table.boolean('primary').notNullable()

			table.string('createdBy').nullable()
			table.dateTime('createdAt').notNullable()
			table.string('updatedBy').nullable()
			table.dateTime('updatedAt').notNullable()
			table.string('deletedBy').nullable()
			table.dateTime('deletedAt').nullable()
		})
}

export function down(knex: Knex) {
	return knex.schema
		.dropTable('EmailAddresses')
		.dropTable('Sessions')
		.dropTable('UserAccounts')
}
