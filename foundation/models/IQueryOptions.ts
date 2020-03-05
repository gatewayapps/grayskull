import { UserContext } from '../context/getUserContext'

export interface IQueryOptions {
	userContext?: UserContext
	order?: any
	include?: any
	limit?: number
	offset?: number
	transaction?: any
}
