import Knex from 'knex'

function enforceDates(record) {
	const KNOWN_DATE_COLUMNS = [
		'expires',
		'expiresAt',
		'createdAt',
		'updatedAt',
		'deletedAt',
		'lastActive',
		'lastPasswordChange',
		'issuedAt',
		'lastUsedAt',
		'activeAt',
		'revokedAt',
		'birthday',
		'RevokedAt'
	]
	const keys = Object.keys(record).filter((k) => KNOWN_DATE_COLUMNS.includes(k))
	keys.forEach((k) => {
		if (record[k] !== undefined && typeof record[k] !== 'object') {
			record[k] = new Date(record[k])
		}
	})
	return record
}

export async function getDataContext(options: Knex.Config): Promise<Knex> {
	if (!(options as any).connection['database']) {
		throw new Error('You must provide a database name')
	}

	options.postProcessResponse = (result) => {
		if (Array.isArray(result)) {
			return result.map((r) => enforceDates(r))
		} else {
			if (typeof result === 'object') {
				return enforceDates(result)
			} else {
				return result
			}
		}
	}
	const knex = Knex(options)
	if (options.debug) {
		knex.on('query', (queryText) => {
			// eslint-disable-next-line no-console
			console.debug(queryText)
		})
	}

	return knex
}

export async function getDataContextFromConnectionString(connectionString: string): Promise<Knex> {
	const connectionUrl = new URL(connectionString)
	let storage: string | undefined
	// eslint-disable-next-line @typescript-eslint/no-explicit-any

	let dialect = connectionUrl.protocol.substr(0, connectionUrl.protocol.length - 1) as
		| 'mysql2'
		| 'sqlite'
		| 'postgres'
		| 'mssql'
	switch (dialect.toString()) {
		case 'mysql':
		case 'jdbc:mysql':
			dialect = 'mysql2'

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
		debug: true,
		connection: {
			user: user,
			password: password,
			host: server,
			database: databaseName,
			filename: storage
		}
	})
}
