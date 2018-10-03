import { DataTypeAbstract, DefineAttributeColumnOptions } from 'sequelize'

export type SequelizeAttribute = string | DataTypeAbstract | DefineAttributeColumnOptions

export type SequelizeAttributes<T extends { [key: string]: any }> = { [P in keyof T]: SequelizeAttribute }
