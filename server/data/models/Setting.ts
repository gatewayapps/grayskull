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
      },
      createdAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    },
    { sequelize, timestamps: true, paranoid: false, tableName: 'Settings' }
  )
  return Setting
}

export default SettingFactory
