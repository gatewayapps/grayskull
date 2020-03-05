exports.up = (knex) => {
	return knex.schema.hasTable('UserAccounts').then((tableExists) => {
		if (tableExists) {
			//this is an existing installation.  We need to update tables
			return knex.schema
				.table('Sessions', (table) => {
					table.dropColumn('fingerprint')
				})
				.table('EmailAddresses', (table) => {
					table.dropColumn('verificationSecret')
				})
				.table('PhoneNumbers', (table) => {
					table.dropColumn('verificationSecret')
				})
		} else {
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
					table.dateTime('lastUsedAt').notNullable()
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
				.createTable('KeyValueCache', (table) => {
					table
						.string('key')
						.primary()
						.unique()
						.notNullable()
					table.string('value')
					table.dateTime('expires').notNullable()
				})
				.createTable('Clients', (table) => {
					table
						.string('client_id', 50)
						.primary()
						.unique()
						.notNullable()
					table.string('name', 50).notNullable()
					table.boolean('pinToHeader').nullable()
					table.string('logoImageUrl', 1024).notNullable()
					table.string('description', 500).nullable()
					table.string('secret', 500).notNullable()
					table.string('baseUrl', 1024).notNullable()
					table.string('homePageUrl', 1024).nullable()
					table.string('redirectUris', 2048).notNullable()
					table.string('scopes', 1024).notNullable()
					table.boolean('public').nullable()
					table.boolean('isActive').notNullable()
					table.string('createdBy').nullable()
					table.dateTime('createdAt').notNullable()
					table.string('updatedBy').nullable()
					table.dateTime('updatedAt').notNullable()
					table.string('deletedBy').nullable()
					table.dateTime('deletedAt').nullable()
				})
				.createTable('UserClients', (table) => {
					table
						.uuid('userClientId')
						.notNullable()
						.primary()
					table.string('userAccountId').notNullable()
					table.string('client_id').notNullable()

					table.string('allowedScopes', 1024).notNullable()
					table.string('deniedScopes', 1024).notNullable()
					table.boolean('revoked').nullable()
					table.string('revokedBy').nullable()
					table.dateTime('RevokedAt').nullable()

					table.string('createdBy').nullable()
					table.dateTime('createdAt').notNullable()
					table.string('updatedBy').nullable()
					table.dateTime('updatedAt').notNullable()
					table.string('deletedBy').nullable()
					table.dateTime('deletedAt').nullable()
				})
				.createTable('RefreshTokens', (table) => {
					table
						.uuid('id')
						.notNullable()
						.primary()

					table.string('userClientId').notNullable()
					table.string('token', 500).unique()
					table.dateTime('issuedAt').notNullable()
					table.dateTime('activeAt').notNullable()
					table.dateTime('expiresAt').nullable()
					table.dateTime('revokedAt').nullable()

					table.string('createdBy').nullable()
					table.string('updatedBy').nullable()
					table.string('revokedBy').nullable()
					table.string('deletedBy').nullable()
					table.dateTime('deletedAt').nullable()
				})
				.createTable('Settings', (table) => {
					table
						.string('key')
						.primary()
						.unique()
						.notNullable()
					table.string('value')
					table.string('type').notNullable()
					table.string('category').notNullable()
				})
				.createTable('PhoneNumbers', (table) => {
					table
						.uuid('phoneNumberId')
						.notNullable()
						.primary()
					table.string('userAccountId').notNullable()
					table
						.string('phoneNumber')
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
	})
}

exports.down = (knex) => {
	return knex.schema
		.dropTable('EmailAddresses')
		.dropTable('Sessions')
		.dropTable('UserAccounts')
}
