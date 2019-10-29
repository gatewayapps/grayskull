import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IConfiguration } from './IConfiguration'

export type ConfigurationInstance = Sequelize.Instance<IConfiguration> & IConfiguration

function ConfigurationFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IConfiguration> = {}
  return sequelize.define<ConfigurationInstance, IConfiguration>('Configuration', attributes, {
    timestamps: true,
    paranoid: true
  })
}

export default ConfigurationFactory
