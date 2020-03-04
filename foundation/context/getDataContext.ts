import Knex from 'knex'

export async function getDataContext(options: Knex.Config): Promise<Knex> {
	if (!(options as any).connection['database']) {
		throw new Error('You must provide a database name')
	}
	const knex = Knex(options)

	return knex
}

export async function getDataContextFromConnectionString(connectionString: string): Promise<Knex> {
	const connectionUrl = new URL(connectionString)
	let storage: string | undefined
	// eslint-disable-next-line @typescript-eslint/no-explicit-any

	let dialect = connectionUrl.protocol.substr(0, connectionUrl.protocol.length - 1) as
		| 'mysql'
		| 'sqlite'
		| 'postgres'
		| 'mssql'
	switch (dialect.toString()) {
		case 'mysql':
		case 'jdbc:mysql':
			dialect = 'mysql'

			break
		case 'sqlite':
			dialect = 'sqlite'
			storage = connectionUrl.pathname
			break
		case 'postgres':
			dialect = 'postgres'
			break
		case 'mssql':
		case 'jdbc:sqlserver':
			dialect = 'mssql'
			break
	}
	if (!dialect) {
		throw new Error('Unsupported dialect: ' + dialect)
	}

	const user = connectionUrl.username
	const password = connectionUrl.password
	const server = connectionUrl.host
	const databaseName = connectionUrl.pathname.substr(1)
	return getDataContext({
		client: dialect,
		connection: {
			user: user,
			password: password,
			host: server,
			database: databaseName,
			filename: storage
		}
	})
}
