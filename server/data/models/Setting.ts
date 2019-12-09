import Sequelize from 'sequelize'

import { Setting } from './ISetting'

function SettingFactory(sequelize: Sequelize.Sequelize) {
  Setting.init(
    {
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
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      }
    },
    { sequelize, timestamps: false, paranoid: false, tableName: 'Settings' }
  )
  return Setting
}

export default SettingFactory
