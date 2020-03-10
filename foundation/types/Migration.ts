import Knex from 'knex'

export interface Migration {
	name: string
	up: (knex: Knex) => Promise<void>
	down: (knex: Knex) => Promise<void>
}
