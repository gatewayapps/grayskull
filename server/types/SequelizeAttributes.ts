import { DataTypeAbstract, ColumnOptions } from 'sequelize'

export type SequelizeAttribute = string | DataTypeAbstract | ColumnOptions

export type SequelizeAttributes<T extends { [key: string]: any }> = { [P in keyof T]: SequelizeAttribute }
