import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IConfiguration } from './IConfiguration'
import { ISecurityConfiguration, SecurityConfiguration } from './SecurityConfiguration'
import { IMailConfiguration, MailConfiguration } from './MailConfiguration'
import { IDatabaseConfiguration, DatabaseConfiguration } from './DatabaseConfiguration'
import { IServerConfiguration, ServerConfiguration } from './ServerConfiguration'

export type ConfigurationInstance = Sequelize.Instance<IConfiguration> & IConfiguration

function ConfigurationFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IConfiguration> = {}
  return sequelize.define<ConfigurationInstance, IConfiguration>('Configuration', attributes, {
    timestamps: true,
    paranoid: true
  })
}

export default ConfigurationFactory
