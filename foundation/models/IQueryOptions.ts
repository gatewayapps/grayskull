import { Transaction, Includeable } from 'sequelize'

import { UserContext } from '../context/getUserContext'

export interface IQueryOptions {
	userContext?: UserContext
	order?: any
	include?: Includeable[] | undefined
	limit?: number
	offset?: number
	transaction?: Transaction
}
