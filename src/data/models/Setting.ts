import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { ISetting } from './ISetting'

export type SettingInstance = Sequelize.Instance<ISetting> & ISetting

function SettingFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<ISetting> = {
    key: {
      primaryKey: true,
      allowNull: false,
      type: Sequelize.STRING
    },
    value: {
      allowNull: false,
      type: Sequelize.STRING
    },
    type: {
      allowNull: false,
      type: Sequelize.STRING
    }
  }
  return sequelize.define<SettingInstance, ISetting>('Setting', attributes, {
    timestamps: true,
    paranoid: true
  })
}

export default SettingFactory
