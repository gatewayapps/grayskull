import { IConfigurationMeta, IConfigurationFilter, IConfigurationUniqueFilter } from '@/interfaces/graphql/IConfiguration'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IConfiguration } from '@data/models/IConfiguration'
import { IUserAccount } from '@data/models/IUserAccount'
import { ConfigurationInstance } from '@data/models/Configuration'
import { AnyWhereOptions, Transaction } from 'sequelize'

export default class ConfigurationServiceBase {}
