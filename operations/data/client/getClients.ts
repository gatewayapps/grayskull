import { convertFilterToSequelizeWhere } from '../../logic/graphQLSequelizeConverter'
import { IClientFilter } from '../../../foundation/types/filterTypes'
import { DataContext } from '../../../foundation/context/getDataContext'
import { OrderItem } from 'sequelize/types'
import { Fn, Col, Literal } from 'sequelize/types/lib/utils'

export async function getClients(
	filter: IClientFilter,
	offset: number,
	limit: number,
	order: string | Fn | Col | Literal | OrderItem[] | undefined,
	dataContext: DataContext
) {
	const convertedFilter = convertFilterToSequelizeWhere(filter)
	return dataContext.Client.findAll({
		limit,
		offset,
		order,
		where: convertedFilter,
		attributes: { exclude: ['secret'] }
	})
}
